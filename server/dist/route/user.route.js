import { Router } from 'express';
import userController from '../controller/user.controller.js';
const router = Router();
router.post('/create_user', userController.createUser);
router.post('/login_user', userController.loginUser);
router.get('/user_info', userController.userInfo);
router.post('/update_user_info', userController.updateUserInfo);
export default router;
