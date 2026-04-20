import { getProfile, updateProfile } from '../services/user.service.js';

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
