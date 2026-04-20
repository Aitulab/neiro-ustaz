import db from '../db/index.js';

export async function checkAchievements(userId) {
  const awarded = [];

  // Get user's current achievements
  const userAchievements = db.prepare(`
    SELECT a.code FROM user_achievements ua
    JOIN achievements a ON a.id = ua.achievement_id
    WHERE ua.user_id = ?
  `).all(userId).map(a => a.code);

  // Helper to award achievement
  function award(code) {
    if (userAchievements.includes(code)) return;
    const achievement = db.prepare('SELECT id, points FROM achievements WHERE code = ?').get(code);
    if (!achievement) return;

    db.prepare('INSERT OR IGNORE INTO user_achievements (user_id, achievement_id) VALUES (?, ?)').run(userId, achievement.id);
    if (achievement.points > 0) {
      db.prepare('UPDATE users SET points = points + ? WHERE id = ?').run(achievement.points, userId);
    }
    awarded.push(code);
  }

  // first_task: completed at least 1 task
  const taskCount = db.prepare('SELECT COUNT(*) as count FROM task_results WHERE user_id = ?').get(userId).count;
  if (taskCount >= 1) award('first_task');

  // streak_3: 3 consecutive days
  const streak = getStreak(userId);
  if (streak >= 3) award('streak_3');
  if (streak >= 7) award('streak_7');

  // community_first: first post
  const postCount = db.prepare('SELECT COUNT(*) as count FROM community_posts WHERE user_id = ?').get(userId).count;
  if (postCount >= 1) award('community_first');

  // expert_level: reached level 3
  const user = db.prepare('SELECT level, points FROM users WHERE id = ?').get(userId);
  if (user && user.level >= 3) award('expert_level');

  // ai_explorer: 10+ AI messages
  const aiMsgCount = db.prepare("SELECT COUNT(*) as count FROM ai_chat_history WHERE user_id = ? AND role = 'user'").get(userId).count;
  if (aiMsgCount >= 10) award('ai_explorer');

  // popular_post: a post with 5+ likes
  const popularPost = db.prepare('SELECT id FROM community_posts WHERE user_id = ? AND likes >= 5 LIMIT 1').get(userId);
  if (popularPost) award('popular_post');

  return awarded;
}

export function getStreak(userId) {
  // Get distinct completion dates, ordered descending
  const dates = db.prepare(`
    SELECT DISTINCT DATE(completed_at) as day
    FROM task_results
    WHERE user_id = ?
    ORDER BY day DESC
    LIMIT 30
  `).all(userId).map(r => r.day);

  if (dates.length === 0) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (prev - curr) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
