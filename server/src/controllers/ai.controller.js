import { chatStream, saveChatMessages, getChatHistory, clearChatHistory, generate } from '../services/ai.service.js';

export async function sendMessage(req, res, next) {
  const requestId = Math.random().toString(36).substring(7);
  const startTime = Date.now();
  
  try {
    const { message } = req.body;
    console.log(`[${requestId}] 💬 AI Chat Request from user ${req.user.id}`);

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Сообщение не может быть пустым', code: 'VALIDATION_ERROR' });
    }

    const stream = await chatStream(req.user.id, message.trim());
    console.log(`[${requestId}] 🚀 Stream started in ${Date.now() - startTime}ms`);
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    if (res.flushHeaders) res.flushHeaders();

    let fullReply = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullReply += content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    saveChatMessages(req.user.id, message.trim(), fullReply);
    res.write('data: [DONE]\n\n');
    res.end();
    console.log(`[${requestId}] ✅ Request completed in ${Date.now() - startTime}ms`);
  } catch (err) {
    console.error(`[${requestId}] ❌ AI Controller Error after ${Date.now() - startTime}ms:`, err.message);
    if (!res.headersSent) {
      next(err);
    } else {
      res.end();
    }
  }
}

export async function generateResponse(req, res, next) {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Промпт не может быть пустым', code: 'VALIDATION_ERROR' });
    }

    const text = await generate(prompt);
    res.json({ success: true, text });
  } catch (err) {
    next(err);
  }
}

export function getHistory(req, res, next) {
  try {
    const history = getChatHistory(req.user.id);

    res.json({ history });
  } catch (err) {
    next(err);
  }
}

export function clearHistory(req, res, next) {
  try {
    clearChatHistory(req.user.id);

    res.json({ message: 'История очищена' });
  } catch (err) {
    next(err);
  }
}
