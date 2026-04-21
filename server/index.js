import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { errorHandler } from './src/middleware/errorHandler.js';

// Import routes
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import aiRoutes from './src/routes/ai.routes.js';
import tasksRoutes from './src/routes/tasks.routes.js';
import communityRoutes from './src/routes/community.routes.js';
import npaRoutes from './src/routes/npa.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────

// CORS — allow frontend
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173', 'https://neiro-ustaz.vercel.app'];

app.use(cors({
  origin: '*',
  credentials: true
}));

// Serve static files (uploaded documents, etc)
app.use(express.static('public'));

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'Слишком много запросов. Попробуйте позже.', code: 'RATE_LIMIT' }
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Слишком много запросов к ИИ. Попробуйте позже.', code: 'RATE_LIMIT' }
});

// ── Routes ─────────────────────────────────────────────

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);        // /api/users/profile, /api/users/me
app.use('/api/user', userRoutes);         // alias: /api/user/me
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/npa', npaRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден', code: 'NOT_FOUND' });
});

// Global error handler
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀 NeiroUstaz server running at http://localhost:${PORT}`);
  console.log(`📚 API base: http://localhost:${PORT}/api`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;
