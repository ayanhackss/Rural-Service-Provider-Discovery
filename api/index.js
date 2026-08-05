// Vercel serverless entry point — wraps the Express app.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config();
const app = require('../server/app');

module.exports = app;
