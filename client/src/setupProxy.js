const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      // target: "http://localhost:8080",
      target: `http://${process.env.PROXY_TARGET || "localhost"}:8080`,
      changeOrigin: true,
    })
  );
};
