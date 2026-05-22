require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

<<<<<<< HEAD
const app = express();
const PORT = process.env.PORT || 4010;
const BP_API_KEY = process.env.BLACKPOINT_API_KEY || '';

// Proxy /v1 requests to the Blackpoint CompassOne API
// Express strips the mount path, so target includes /v1
const v1ProxyOptions = {
  target: 'https://api.blackpointcyber.com/v1',
  changeOrigin: true,
};
if (BP_API_KEY) {
  v1ProxyOptions.headers = { Authorization: 'Bearer ' + BP_API_KEY };
}
app.use('/v1', createProxyMiddleware(v1ProxyOptions));

// Optional backend proxies
if (process.env.DEFENDER_XDR_PROXY_TARGET) {
  app.use('/api/defender-xdr', createProxyMiddleware({
    target: process.env.DEFENDER_XDR_PROXY_TARGET,
    changeOrigin: true,
  }));
}
if (process.env.O365_PROXY_TARGET) {
  app.use('/api/o365', createProxyMiddleware({
    target: process.env.O365_PROXY_TARGET,
    changeOrigin: true,
  }));
}
if (process.env.SENTINEL_PROXY_TARGET) {
  app.use('/api/sentinel', createProxyMiddleware({
    target: process.env.SENTINEL_PROXY_TARGET,
    changeOrigin: true,
  }));
}
if (process.env.DEFENDER_MCP_PROXY_TARGET) {
  app.use('/api/defender-mcp', createProxyMiddleware({
    target: process.env.DEFENDER_MCP_PROXY_TARGET,
    changeOrigin: true,
  }));
}

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

// SPA fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log('Dashboard running on port ' + PORT);
  if (!BP_API_KEY) {
    console.warn('WARNING: BLACKPOINT_API_KEY not set - API calls will fail');
  }
});

=======
const app = express();
const PORT = process.env.PORT || 4010;
const BP_API_KEY = process.env.BLACKPOINT_API_KEY || '';

// Proxy /v1 requests to the Blackpoint CompassOne API
// Express strips the mount path, so target includes /v1
const v1ProxyOptions = {
  target: 'https://api.blackpointcyber.com/v1',
  changeOrigin: true,
};
if (BP_API_KEY) {
  v1ProxyOptions.headers = { Authorization: 'Bearer ' + BP_API_KEY };
}
app.use('/v1', createProxyMiddleware(v1ProxyOptions));

// Optional backend proxies
if (process.env.DEFENDER_XDR_PROXY_TARGET) {
  app.use('/api/defender-xdr', createProxyMiddleware({
    target: process.env.DEFENDER_XDR_PROXY_TARGET,
    changeOrigin: true,
  }));
}
if (process.env.O365_PROXY_TARGET) {
  app.use('/api/o365', createProxyMiddleware({
    target: process.env.O365_PROXY_TARGET,
    changeOrigin: true,
  }));
}
if (process.env.SENTINEL_PROXY_TARGET) {
  app.use('/api/sentinel', createProxyMiddleware({
    target: process.env.SENTINEL_PROXY_TARGET,
    changeOrigin: true,
  }));
}
if (process.env.DEFENDER_MCP_PROXY_TARGET) {
  app.use('/api/defender-mcp', createProxyMiddleware({
    target: process.env.DEFENDER_MCP_PROXY_TARGET,
    changeOrigin: true,
  }));
}

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

// SPA fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log('Dashboard running on port ' + PORT);
  if (!BP_API_KEY) {
    console.warn('WARNING: BLACKPOINT_API_KEY not set - API calls will fail');
  }
});
>>>>>>> e7473cead40f3314f532fd53ed5e94e0dd0ecbaf