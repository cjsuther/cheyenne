import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const fileController = container.resolve('fileController');
const router = express.Router();

router
    .get('/file/:path', useAuth, fileController.get)
    .get('/file/temp/:path', useAuth, fileController.getTemp)
    .post('/file', useAuth, fileController.post);

export default router;