import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { langMiddleware } from '../middleware/lang.js';
import { sendMessage, getHistory, clearHistory, generateResponse } from '../controllers/ai.controller.js';

const router = Router();

router.use(authMiddleware);
router.use(langMiddleware);

router.post('/chat', sendMessage);
router.get('/chat/history', getHistory);
router.delete('/chat/history', clearHistory);
router.post('/generate', generateResponse);

export default router;
