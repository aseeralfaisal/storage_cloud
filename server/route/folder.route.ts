
import { Router } from 'express';
import folderController from '../controller/folder.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/create_folder', authenticateToken, folderController.createFolder);
router.post('/remove_folder', authenticateToken, folderController.deleteFolder)
router.post('/update_folder', authenticateToken, folderController.updateFolder)
router.get("/get_folder_path", authenticateToken, folderController.getFoldersBasedOnPath);

export default router;
