import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { langMiddleware } from '../middleware/lang.js';
import { me, updateMe } from '../controllers/user.controller.js';

const router = Router();

router.use(authMiddleware);
router.use(langMiddleware);

router.get('/me', me);
router.get('/profile', me); // alias for frontend compatibility
router.patch('/me', updateMe);
router.put('/profile', updateMe); // alias for frontend compatibility

export default router;
