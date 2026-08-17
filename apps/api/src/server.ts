import { app } from './app';
import { env } from './core/config';

const PORT = env.port

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📖 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${env.nodeEnv}`);
})

// Graceful shutdown
const shutdown = (signal: string): void => {
  console.log(`\n${signal} received. Shutting down gracefully...`)
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));