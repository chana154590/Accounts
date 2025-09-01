import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { ensureDir } from '../utils/ensureDir';
import { uploadController } from '../controllers/uploadController';

const router = Router();

// multer storage: destination decided dynamically based on form field 'destination'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
  const base = process.env.STORAGE_ROOT || './storage';
  ensureDir(base);
  cb(null, base);
},
  filename: (req, file, cb) => {
    // keep original name or add timestamp to avoid collisions
    const unique = `${Date.now()}_${file.originalname}`;
    cb(null, unique);
  }
});

const upload = multer({ storage });

/**
 * POST /upload
 * form-data:
 *  - file: the file to upload
 *  - destination: (optional) relative folder under STORAGE_ROOT where file will be stored (e.g. 'images/user1')
 */
router.post('/', upload.single('file'), uploadController);

export default router;
