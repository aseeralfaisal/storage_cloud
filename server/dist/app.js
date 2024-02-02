import express from 'express';
import 'dotenv/config.js';
import fileUpload from 'express-fileupload';
import userRoutes from './route/user.route.js';
import uploadRoutes from './route/upload.route.js';
import folderRoutes from './route/folder.route.js';
import fileRoutes from './route/file.route.js';
import cors from 'cors';
import authController from './controller/auth.controller.js';
const port = process.env.PORT || 5100;
const app = express();
app.use(express.json());
app.use(fileUpload());
app.use(cors({ origin: process.env.BASE_URL }));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
const routes = [userRoutes, uploadRoutes, fileRoutes, folderRoutes];
routes.forEach((route) => {
    app.use(route);
});
app.get('/', (_, res) => {
    res.send('Hurray! Server is working.');
});
app.post('/refresh-token', authController.handleRefreshToken);
app.listen(port, () => {
    console.log(`Server Running --> http://localhost:${port}`);
});
