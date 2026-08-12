import multer from 'multer';
import { ApiError } from './ApiError';

const storage = multer.memoryStorage(); // buffer in memory, then push to S3

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, WEBP images allowed') as any, false);
    }
    cb(null, true);
  },
});