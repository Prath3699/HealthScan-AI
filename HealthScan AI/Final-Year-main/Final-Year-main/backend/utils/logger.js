/**
 * Tiny structured logger (no external dependency).
 * Emits one JSON object per line so log aggregators (Render, Datadog, ...)
 * can parse it. Honours LOG_LEVEL (silent < error < warn < info < debug).
 */
const LEVELS = { silent: 0, error: 1, warn: 2, info: 3, debug: 4 };

const threshold = LEVELS[(process.env.LOG_LEVEL || "info").toLowerCase()] ?? LEVELS.info;

const write = (level, stream, msg, extra) => {
  if (LEVELS[level] > threshold) return;
  const line = { level, time: new Date().toISOString(), msg };
  if (extra && Object.keys(extra).length > 0) Object.assign(line, extra);
  stream.write(JSON.stringify(line) + "\n");
};

const logger = {
  error: (msg, extra) => write("error", process.stderr, msg, extra),
  warn: (msg, extra) => write("warn", process.stdout, msg, extra),
  info: (msg, extra) => write("info", process.stdout, msg, extra),
  debug: (msg, extra) => write("debug", process.stdout, msg, extra),
};

module.exports = logger;
