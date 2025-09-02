import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { ensureDir } from '../utils/ensureDir';
import { uploadController } from '../controllers/uploadController';

const router = Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
  const base = process.env.STORAGE_ROOT || './storage';
  ensureDir(base);
  cb(null, base);
},
  filename: (req, file, cb) => {

    const unique = `${Date.now()}_${file.originalname}`;
    cb(null, unique);
  }
});

const upload = multer({ storage });
router.post('/', upload.single('file'), uploadController);

export default router;
