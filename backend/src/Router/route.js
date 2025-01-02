import express from 'express';
import Userprofiler from '../Controller/userController.js';
import {profilephotoUpload} from '../utils/multer.js'
import Authorization from '../Middleware/isAuthorized.js';
const router = express.Router();

router.post('/api/register', profilephotoUpload, Userprofiler.register);
router.post('/api/login', Userprofiler.login);
router.post('/api/update', profilephotoUpload, Authorization, Userprofiler.updateprofile);

export default router;