// src/config/viewEngine.js

import { engine } from 'express-handlebars';
import * as Allow from '@handlebars/allow-prototype-access';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Workaround for ES module compatibility
const allowPrototypeAccess = Allow.allowInsecurePrototypeAccess || Allow.default || Allow;


// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function configureViewEngine(app) {
  const rootPath = path.join(__dirname, '..', '..'); // go up to project root
  const globalViewsPath = path.join(rootPath, 'src', 'views');
  const globalPartialsPath = path.join(globalViewsPath, 'partials');
  const layoutsDir = path.join(globalViewsPath, 'layouts');

  const modulesPath = path.join(rootPath, 'src', 'modules');
  const partialsDirs = [globalPartialsPath];

  // Collect module-specific partials
  fs.readdirSync(modulesPath, { withFileTypes: true }).forEach(dirent => {
    if (dirent.isDirectory()) {
      const modulePartialsPath = path.join(modulesPath, dirent.name, 'views', 'partials');
      if (fs.existsSync(modulePartialsPath)) {
        partialsDirs.push(modulePartialsPath);
      }
    }
  });

  // Collect all valid module views directories
  const moduleViews = fs.readdirSync(modulesPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => path.join(modulesPath, dirent.name, 'views'))
    .filter(viewPath => fs.existsSync(viewPath));

  // Setup Handlebars engine
  app.engine('html', engine({
    extname: '.html',
    defaultLayout: 'main',
    layoutsDir,
    partialsDir: partialsDirs,
    handlebars: allowPrototypeAccess(Handlebars),
  }));

  app.set('view engine', 'html');
  app.set('views', [globalViewsPath, ...moduleViews]);
}
