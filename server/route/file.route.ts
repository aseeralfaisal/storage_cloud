import { Router } from "express";
import fileController from '../controller/file.controller.js'

const router = Router();

router.get('/get_file', fileController.getFile);
router.post('/create_file', fileController.createFile);
router.post('/update_file', fileController.updateFile);
router.post('/remove_file', fileController.deleteFile);


export default router;
