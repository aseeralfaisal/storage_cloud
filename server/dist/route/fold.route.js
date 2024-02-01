import { Router } from 'express';
import folderController from '../controller/fold.controller.js';
const router = Router();
router.post('/create_fold', folderController.createFolder);
router.get("/get_fold", folderController.getFolders);
export default router;
