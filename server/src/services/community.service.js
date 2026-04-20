import db from '../db/index.js';
import { checkAchievements } from './achievements.service.js';
import { addPoints } from './user.service.js';

export function getPosts({ lang = 'ru', sort = 'new', page = 1, limit = 20, userId }) {
  const offset = (page - 1) * limit;
  const orderBy = sort === 'popular' ? 'cp.likes DESC' : 'cp.created_at DESC';

  const posts = db.prepare(`
    SELECT
      cp.id,
      cp.title,
      cp.content,
      cp.tags,
      cp.lang,
      cp.likes,
      cp.replies_count,
      cp.created_at,
      u.id AS author_id,
      u.full_name AS author_name,
      u.level AS author_level,
      CASE WHEN pl.user_id IS NOT NULL THEN 1 ELSE 0 END AS user_liked
    FROM community_posts cp
    JOIN users u ON u.id = cp.user_id
    LEFT JOIN post_likes pl ON pl.post_id = cp.id AND pl.user_id = ?
    WHERE cp.lang = ?
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `).all(userId, lang, limit, offset);

  const total = db.prepare('SELECT COUNT(*) as count FROM community_posts WHERE lang = ?').get(lang).count;

  return {
    success: true,
    posts: posts.map(p => ({
      id: p.id,
      title: p.title || '',
      content: p.content,
      tags: JSON.parse(p.tags || '[]'),
      author: {
        id: p.author_id,
        full_name: p.author_name,
        level: p.author_level
      },
      likes: p.likes,
      user_liked: !!p.user_liked,
      replies_count: p.replies_count || 0,
      created_at: p.created_at
    })),
    total,
    page
  };
}

export function createPost(userId, title, content, tags, lang = 'ru') {
  const tgs = JSON.stringify(tags || []);
  const result = db.prepare(`
    INSERT INTO community_posts (user_id, title, content, tags, lang)
    VALUES (?, ?, ?, ?, ?)
  `).run(userId, title, content, tgs, lang);

  // Check if this is user's first post — award 5 bonus points
  const postCount = db.prepare('SELECT COUNT(*) as count FROM community_posts WHERE user_id = ?').get(userId).count;
  let pointsEarned = 0;
  if (postCount === 1) {
    addPoints(userId, 5);
    pointsEarned = 5;
  }

  // Check achievements after post (non-blocking)
  checkAchievements(userId).catch(err => console.error('Achievement check failed:', err.message));

  return {
    id: result.lastInsertRowid,
    content,
    created_at: new Date().toISOString(),
    points_earned: pointsEarned
  };
}

export function toggleLike(userId, postId) {
  const existing = db.prepare('SELECT * FROM post_likes WHERE user_id = ? AND post_id = ?').get(userId, postId);

  const result = db.transaction(() => {
    if (existing) {
      // Remove like
      db.prepare('DELETE FROM post_likes WHERE user_id = ? AND post_id = ?').run(userId, postId);
      db.prepare('UPDATE community_posts SET likes = likes - 1 WHERE id = ?').run(postId);
    } else {
      // Add like
      db.prepare('INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)').run(userId, postId);
      db.prepare('UPDATE community_posts SET likes = likes + 1 WHERE id = ?').run(postId);

      // Popularity bonus check: if reaching 5 likes for the first time
      const post = db.prepare('SELECT user_id, likes FROM community_posts WHERE id = ?').get(postId);
      if (post && post.likes === 5) {
        addPoints(post.user_id, 10);
      }
    }

    const post = db.prepare('SELECT likes FROM community_posts WHERE id = ?').get(postId);
    // Check achievements for liker
    checkAchievements(userId).catch(err => console.error('Achievement check failed:', err.message));
    
    return { liked: !existing, likes: post?.likes || 0 };
  })();

  return result;
}

export function createReply(userId, postId, content) {
  const result = db.transaction(() => {
    const res = db.prepare(`
      INSERT INTO community_replies (user_id, post_id, content)
      VALUES (?, ?, ?)
    `).run(userId, postId, content);

    db.prepare('UPDATE community_posts SET replies_count = replies_count + 1 WHERE id = ?').run(postId);
    return res;
  })();

  // Check achievements for replier
  checkAchievements(userId).catch(err => console.error('Achievement check failed:', err.message));

  return { success: true, reply_id: result.lastInsertRowid };
}

export function getReplies(postId) {
  const replies = db.prepare(`
    SELECT
      cr.id,
      cr.content,
      cr.created_at,
      u.full_name,
      u.level
    FROM community_replies cr
    JOIN users u ON u.id = cr.user_id
    WHERE cr.post_id = ?
    ORDER BY cr.created_at ASC
  `).all(postId);

  return replies;
}
