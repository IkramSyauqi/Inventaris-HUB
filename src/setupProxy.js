const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    ['users/login','products/', 'users/logout', 'users/get/all', 'users/:id'],  // Ubah ini ke path yang sesuai dengan endpoint API Anda
    createProxyMiddleware({
      target: process.env.API,, 
      changeOrigin: true,
    })
  );
};
