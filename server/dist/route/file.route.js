import { Router } from "express";
import fileController from '../controller/file.controller.js';
import { authenticateToken } from "../middleware/auth.middleware.js";
const router = Router();
router.get('/get_file', authenticateToken, fileController.getFile);
router.post('/create_file', authenticateToken, fileController.createFile);
router.post('/update_file', authenticateToken, fileController.updateFile);
router.post('/remove_file', authenticateToken, fileController.deleteFile);
export default router;
