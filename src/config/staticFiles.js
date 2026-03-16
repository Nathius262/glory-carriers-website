import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';


// Derive the equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set Handlebars as the template engine with .html extension
const app = express();

// Serve static files (CSS, JS, images)
app.use('/assets', express.static(path.join(__dirname, '..', '..', 'public')));

export default app;