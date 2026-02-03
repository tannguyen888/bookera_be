const level = (process.env.LOG_LEVEL || 'info').toLowerCase();

const shouldLog = (msgLevel) => {
  const levels = ['debug', 'info', 'warn', 'error'];
  return levels.indexOf(msgLevel) >= levels.indexOf(level);
};

module.exports = {
  debug: (...args) => { if (shouldLog('debug')) console.debug('[DEBUG]', ...args); },
  info: (...args) => { if (shouldLog('info')) console.log('[INFO]', ...args); },
  warn: (...args) => { if (shouldLog('warn')) console.warn('[WARN]', ...args); },
  error: (...args) => { if (shouldLog('error')) console.error('[ERROR]', ...args); },
};
