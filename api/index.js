// Vercel serverless entry point.
// Vercel calls this file as a serverless function and passes HTTP requests to Express.
const app = require('../server/app');

module.exports = app;
