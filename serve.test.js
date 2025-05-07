import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import loadModules from './src/config/load_modules.js';

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Global views and partials
const globalViewsPath = path.join(__dirname, 'src', 'views');
const globalPartialsPath = path.join(globalViewsPath, 'partials');

// Collect partials: global first, then module-specific partials
const modulesPath = path.join(__dirname, 'src', 'modules');
const partialsDirs = [globalPartialsPath];

fs.readdirSync(modulesPath, { withFileTypes: true }).forEach(dirent => {
  if (dirent.isDirectory()) {
    const modulePartialsPath = path.join(modulesPath, dirent.name, 'views', 'partials');
    if (fs.existsSync(modulePartialsPath)) {
      partialsDirs.push(modulePartialsPath);
    }
  }
});

// Configure Handlebars engine with .html extension
app.engine('html', engine({
  extname: '.html',
  partialsDir: partialsDirs,
}));
app.set('view engine', 'html');
app.set('views', globalViewsPath); // main template directory

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load dynamic routes from modules
await loadModules(app);

// Default home route
app.get('/', (req, res) => {
  res.render('index', { title: 'Welcome to Nexus App' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
