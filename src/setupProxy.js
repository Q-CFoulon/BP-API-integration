/**
 * CRA dev-server proxy — forwards /v1/* requests to the CompassOne API.
 * This avoids CORS issues when running `npm run dashboard` locally.
 * The Authorization / x-tenant-id headers sent by the browser are passed through unchanged.
 *
 * Optional proxies for security service backends:
 *   DEFENDER_XDR_PROXY_TARGET  — Defender XDR summary API
 *   O365_PROXY_TARGET          — Office 365 connector aggregation API
 *   SENTINEL_PROXY_TARGET      — Microsoft Sentinel incidents API
 *   DEFENDER_MCP_PROXY_TARGET  — Defender MCP response actions API
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  if (process.env.DEFENDER_XDR_PROXY_TARGET) {
    app.use(
      '/api/defender-xdr',
      createProxyMiddleware({
        target: process.env.DEFENDER_XDR_PROXY_TARGET,
        changeOrigin: true,
        logLevel: 'warn',
      })
    );
  }

  if (process.env.O365_PROXY_TARGET) {
    app.use(
      '/api/o365',
      createProxyMiddleware({
        target: process.env.O365_PROXY_TARGET,
        changeOrigin: true,
        logLevel: 'warn',
      })
    );
  }

  if (process.env.SENTINEL_PROXY_TARGET) {
    app.use(
      '/api/sentinel',
      createProxyMiddleware({
        target: process.env.SENTINEL_PROXY_TARGET,
        changeOrigin: true,
        logLevel: 'warn',
      })
    );
  }

  if (process.env.DEFENDER_MCP_PROXY_TARGET) {
    app.use(
      '/api/defender-mcp',
      createProxyMiddleware({
        target: process.env.DEFENDER_MCP_PROXY_TARGET,
        changeOrigin: true,
        logLevel: 'warn',
      })
    );
  }

  app.use(
    '/v1',
    createProxyMiddleware({
      target: 'https://api.blackpointcyber.com',
      changeOrigin: true,
      logLevel: 'warn',
    })
  );
};
