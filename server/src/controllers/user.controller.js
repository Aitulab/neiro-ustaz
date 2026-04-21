import { getProfile, updateProfile, getAllUsers } from '../services/user.service.js';

export function listAllUsers(req, res, next) {
  try {
    const users = getAllUsers();
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    next(err);
  }
}

export function me(req, res, next) {
  try {
    const profile = getProfile(req.user.id, req.lang);

    res.json({
      success: true,
      user: profile
    });
  } catch (err) {
    next(err);
  }
}

export function updateMe(req, res, next) {
  try {
    const user = updateProfile(req.user.id, req.body);

    res.json({
      success: true,
      user,
      message: 'Профиль обновлён'
    });
  } catch (err) {
    next(err);
  }
}
