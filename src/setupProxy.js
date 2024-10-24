const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    ['users/login','products/', 'users/logout', '/users/get/all', '/users/:id'],  
    createProxyMiddleware({
      target: 'https://inventaris-app-backend.vercel.app', 
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      // onProxyReq: (proxyReq, req, res) => {
      //   // Log detail request
      //   console.log('Request URL:', req.url);
      //   console.log('Request Method:', req.method);
      //   console.log('Request Headers:', req.headers);
      // },
      // onProxyRes: (proxyRes, req, res) => {
      //   // Log response
      //   console.log('Response Status:', proxyRes.statusCode);
      //   console.log('Response Headers:', proxyRes.headers);
      // },
      // onError: (err, req, res) => {
      //   console.error('Proxy Error:', err);
      //   res.status(500).send('Proxy Error');
      // },
    })
  );
};
