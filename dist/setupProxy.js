"use strict";
/**
 * CRA dev-server proxy — forwards /v1/* requests to the CompassOne API.
 * This avoids CORS issues when running `npm run dashboard` locally.
 * The Authorization / x-tenant-id headers sent by the browser are passed through unchanged.
 */
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    if (process.env.DEFENDER_XDR_PROXY_TARGET) {
        app.use('/api/defender-xdr', createProxyMiddleware({
            target: process.env.DEFENDER_XDR_PROXY_TARGET,
            changeOrigin: true,
            logLevel: 'warn',
        }));
    }
    app.use('/v1', createProxyMiddleware({
        target: 'https://api.blackpointcyber.com',
        changeOrigin: true,
        logLevel: 'warn',
    }));
};
//# sourceMappingURL=setupProxy.js.map