import { registerUser, loginUser } from '../services/auth.service.js';

export async function register(req, res, next) {
  try {
    const { full_name, email, phone, password } = req.body;

    // Validation
    if (!full_name || !full_name.trim()) {
      return res.status(400).json({ error: 'ФИО обязательно', code: 'VALIDATION_ERROR' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email обязателен', code: 'VALIDATION_ERROR' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Пароль должен содержать минимум 6 символов', code: 'VALIDATION_ERROR' });
    }

    const result = await registerUser({ full_name: full_name.trim(), email: email.trim().toLowerCase(), phone, password });

    res.status(201).json({
      success: true,
      token: result.token,
      user: result.user
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны', code: 'VALIDATION_ERROR' });
    }

    const result = await loginUser({ email: email.trim().toLowerCase(), password });

    res.status(200).json({
      success: true,
      token: result.token,
      user: result.user
    });
  } catch (err) {
    next(err);
  }
}
