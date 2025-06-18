// src/middleware/moduleViews.js
import path from 'path';
import fs from 'fs';
import configureViewEngine from '../config/viewEngine.js';

export default function useModuleViews(moduleName) {
  return function (req, res, next) {
    const rootPath = path.resolve();
    const moduleViewsPath = path.join(rootPath, 'src', 'modules', moduleName, 'views');

    // 1. Ensure base configuration is loaded (only once)
    if (!req.app.engines?.html) {
      configureViewEngine(req.app);
    }

    // 2. Skip if module views don't exist
    if (!fs.existsSync(moduleViewsPath)) {
      return next();
    }

    // 3. Simply modify the views path to include module views first
    const currentViews = req.app.get('views') || [];
    req.app.set('views', [
      moduleViewsPath,
      ...(Array.isArray(currentViews) 
        ? currentViews.filter(p => p !== moduleViewsPath) 
        : [currentViews])
    ]);

    next();
  };
}