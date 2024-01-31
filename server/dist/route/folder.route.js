import { Router } from 'express';
import folderController from '../controller/folder.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
const router = Router();
router.post('/create_folder', folderController.createFolder);
router.post('/remove_folder', folderController.deleteFolder);
router.post('/update_folder', authenticateToken, folderController.updateFolder);
router.get("/get_folder", authenticateToken, folderController.getFolders);
export default router;
