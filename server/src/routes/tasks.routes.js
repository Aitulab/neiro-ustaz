import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { langMiddleware } from '../middleware/lang.js';
import { getToday, submitAnswer } from '../controllers/tasks.controller.js';

const router = Router();

router.use(authMiddleware);
router.use(langMiddleware);

router.get('/today', getToday);
router.post('/:id/answer', submitAnswer);

export default router;
