import { getPosts, createPost, toggleLike, createReply, getReplies } from '../services/community.service.js';

export function listPosts(req, res, next) {
  try {
    const { sort = 'new', page = 1, limit = 20 } = req.query;

    const result = getPosts({
      lang: req.lang,
      sort,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      userId: req.user.id
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

export function addPost(req, res, next) {
  try {
    const { title, content, tags } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Содержание поста не может быть пустым', code: 'VALIDATION_ERROR' });
    }

    const result = createPost(req.user.id, title, content.trim(), tags, req.lang);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export function likePost(req, res, next) {
  try {
    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Неверный ID поста', code: 'VALIDATION_ERROR' });
    }

    const result = toggleLike(req.user.id, postId);

    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export function addReplyRoute(req, res, next) {
  try {
    const postId = parseInt(req.params.id, 10);
    const { content } = req.body;

    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Неверный ID поста', code: 'VALIDATION_ERROR' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Ответ не может быть пустым', code: 'VALIDATION_ERROR' });
    }

    const result = createReply(req.user.id, postId, content.trim());
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export function listRepliesRoute(req, res, next) {
  try {
    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Неверный ID поста', code: 'VALIDATION_ERROR' });
    }

    const replies = getReplies(postId);
    res.json({ success: true, replies });
  } catch (err) {
    next(err);
  }
}
