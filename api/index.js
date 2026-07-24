// Vercel serverless entry point — wraps the Express app.
require('dotenv').config();
const app = require('../server/app');

module.exports = app;
