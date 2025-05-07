import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function loadModules(app) {
  const modulesPath = path.join(__dirname, '../modules');

  const modules = fs.readdirSync(modulesPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const moduleName of modules) {
    const routesDir = path.join(modulesPath, moduleName, 'routes');

    if (!fs.existsSync(routesDir)) continue;

    const routeFiles = fs.readdirSync(routesDir)
      .filter(file => file.endsWith('.routes.js'));

    for (const file of routeFiles) {
      const isAdmin = file.startsWith('admin.');
      const routePath = isAdmin
        ? `/admin/${moduleName}`
        : `/${moduleName}`;

      const routeFilePath = path.join(routesDir, file);
      const routeFileUrl = pathToFileURL(routeFilePath); // ✅ convert to file:// URL
      const routeModule = await import(routeFileUrl.href);

      app.use(routePath, routeModule.default);

      console.log(`✅ Loaded ${isAdmin ? 'admin' : 'public'} route: ${routePath}`);
    }
  }
}
