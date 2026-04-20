import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { langMiddleware } from '../middleware/lang.js';
import { listPosts, addPost, likePost, addReplyRoute, listRepliesRoute } from '../controllers/community.controller.js';

const router = Router();

router.use(authMiddleware);
router.use(langMiddleware);

router.get('/posts', listPosts);
router.post('/posts', addPost);
router.post('/posts/:id/like', likePost);
router.post('/posts/:id/replies', addReplyRoute);
router.get('/posts/:id/replies', listRepliesRoute);

export default router;
