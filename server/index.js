// Local development entry point — imports the app and starts the HTTP server.
// On Vercel, api/index.js is used instead (no listen() needed there).
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
