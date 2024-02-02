import { Router } from 'express';
import userController from '../controller/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
const router = Router();
router.post('/create_user', userController.createUser);
router.post('/login_user', userController.loginUser);
router.get('/user_info', authenticateToken, userController.userInfo);
router.post('/update_user_info', authenticateToken, userController.updateUserInfo);
export default router;
