import { Schema, model, Types } from 'mongoose';

export interface IFileDoc {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  storagePath: string; // path on disk relative to project
  gridFsId?: Types.ObjectId; // id in GridFS files collection
  uploadedAt: Date;
}

const FileSchema = new Schema<IFileDoc>({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String },
  size: { type: Number, required: true },
  storagePath: { type: String, required: true },
  gridFsId: { type: Schema.Types.ObjectId },
  uploadedAt: { type: Date, default: () => new Date() },
});

export const FileModel = model<IFileDoc>('File', FileSchema);
