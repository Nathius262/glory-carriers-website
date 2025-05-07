import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';


// Derive the equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set Handlebars as the template engine with .html extension
const app = express();

// Serve static files (CSS, JS, images)
app.use('', express.static(path.join(__dirname, '..', '..', 'public')));
app.use('/admin', express.static(path.join(__dirname, '..', '..', 'public')));
app.use('/admin/user', express.static(path.join(__dirname, '..', '..', 'public')));
app.use('/admin/role', express.static(path.join(__dirname, '..', '..', 'public')));
app.use('/admin/sermon', express.static(path.join(__dirname, '..', '..', 'public')));
app.use('/admin/zoe-record', express.static(path.join(__dirname, '..', '..', 'public')));
app.use('/admin/nowword', express.static(path.join(__dirname, '..', '..', 'public')));
app.use('/admin/department', express.static(path.join(__dirname, '..', '..', 'public')));
app.use('/auth', express.static(path.join(__dirname, '..', '..', 'public')));
app.use('/media', express.static(path.join(__dirname, '..', '..', 'public')));
app.use('/department', express.static(path.join(__dirname, '..', '..', 'public')));
app.use('/media/sermon', express.static(path.join(__dirname, '..', '..', 'public')));

export default app;