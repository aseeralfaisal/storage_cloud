import { Router } from 'express';
import folderController from '../controller/folder.controller.js';
const router = Router();
router.post('/create_folder', folderController.createFolder);
router.post('/remove_folder', folderController.deleteFolder);
router.post('/update_folder', folderController.updateFolder);
router.get("/get_folder", folderController.getFolders);
export default router;
