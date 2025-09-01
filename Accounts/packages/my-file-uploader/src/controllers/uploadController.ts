import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { FileModel } from '../models/FileModel';

export async function uploadController(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded (field name must be "file")' });
    }

    // file saved on disk by multer
    const fileOnDiskPath = req.file.path; // absolute or relative depending on multer
    const filename = req.file.filename;
    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype;
    const size = req.file.size;

    // save to GridFS
    const conn = mongoose.connection;
    if (!conn.db) throw new Error('MongoDB connection not initialized');

    const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });

    // create read stream from file on disk
    const readStream = fs.createReadStream(fileOnDiskPath);
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: mimeType,
      metadata: {
        originalName,
        storedAt: new Date()
      }
    });

    readStream.pipe(uploadStream)
      .on('error', (err) => {
        console.error('GridFS upload error', err);
        return res.status(500).json({ error: 'Failed to save file to DB' });
      })
      .on('finish', async () => {
        // save metadata document
        const relativePath = path.relative(process.cwd(), fileOnDiskPath);
        const fileDoc = await FileModel.create({
          filename,
          originalName,
          mimeType,
          size,
          storagePath: relativePath,
          gridFsId: uploadStream.id,
          uploadedAt: new Date()
        });

        return res.status(201).json({
          message: 'File saved to disk and DB',
          file: {
            id: fileDoc._id,
            filename: fileDoc.filename,
            originalName: fileDoc.originalName,
            mimeType: fileDoc.mimeType,
            size: fileDoc.size,
            storagePath: fileDoc.storagePath,
            gridFsId: fileDoc.gridFsId
          }
        });
      });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error', details: (err as Error).message });
  }
}
