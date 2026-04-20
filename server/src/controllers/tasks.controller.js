import { getTodayTask, answerTask } from '../services/tasks.service.js';

export async function getToday(req, res, next) {
  try {
    const task = await getTodayTask(req.user.id, req.lang);

    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function submitAnswer(req, res, next) {
  try {
    const taskId = parseInt(req.params.id, 10);
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Неверный ID задания', code: 'VALIDATION_ERROR' });
    }

    const result = await answerTask(req.user.id, taskId, req.body, req.lang);

    res.json(result);
  } catch (err) {
    next(err);
  }
}
