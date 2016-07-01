// Global configuration

// hacks to be able to load this file from webpack as well
var wnd = {};
try { wnd = window; } catch(e) { /* ok */ }
function isDev() { return !process.env.NODE_ENV || process.env.NODE_ENV === 'development'; }

module.exports = {

  // replaced by webpack
  isDev:            isDev(),
  appName:          process.env.APP_NAME,
  appVersion:       process.env.APP_VERSION,

};
