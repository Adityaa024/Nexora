import { Router } from 'express';
import { register, login, getPatients, googleAuth } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/patients', getPatients);
router.post('/google', googleAuth);

export default router;
