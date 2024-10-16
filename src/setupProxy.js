const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    ['users/login','products/'],  // Ubah ini ke path yang sesuai dengan endpoint API Anda
    createProxyMiddleware({
      target: 'https://inventaris-app-backend.vercel.app', 
      changeOrigin: true,
    })
  );
};
