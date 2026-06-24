import { Router } from 'express';
import { bookToken, scanArrival, changeState, getActiveQueue, getAllQueue, getPatientHistory, announceToken } from '../controllers/queueController';

const router = Router();

router.post('/book', bookToken);
router.post('/scan', scanArrival);
router.post('/state', changeState);
router.post('/announce', announceToken);
router.get('/active', getActiveQueue);
router.get('/all', getAllQueue);
router.get('/history/:patientId', getPatientHistory);

export default router;
