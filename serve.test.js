import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import loadModules from './config/load_modules.cjs';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set up Handlebars with .html extension
app.engine('html', engine({ extname: '.html' }));
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views')); // Global views

// Collect partials from all modules
const modulesPath = path.join(__dirname, 'modules');
const partialsDirs = [path.join(__dirname, 'views')]; // Global views first

fs.readdirSync(modulesPath, { withFileTypes: true }).forEach(dirent => {
  if (dirent.isDirectory()) {
    const moduleViewsPath = path.join(modulesPath, dirent.name, 'views');
    if (fs.existsSync(moduleViewsPath)) {
      partialsDirs.push(moduleViewsPath);
    }
  }
});

// Re-register engine with all partials
app.engine('html', engine({
  extname: '.html',
  partialsDir: partialsDirs
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load dynamic routes
loadModules(app);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
