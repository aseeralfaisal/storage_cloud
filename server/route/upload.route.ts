import { Router } from 'express';
import uploadController from '../controller/upload.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/upload', uploadController.uploadToCloud);
router.get('/storage_size', uploadController.getBucketSize);

export default router;
