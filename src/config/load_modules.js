import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function loadModules(app) {
  const modulesPath = path.join(__dirname, '../modules');
  const globalRoutesPath = path.join(__dirname, '../routes');

  // ✅ Load module routes
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

      const routeFileUrl = pathToFileURL(path.join(routesDir, file));
      const routeModule = await import(routeFileUrl.href);

      app.use(routePath, routeModule.default);
      console.log(`✅ Loaded ${isAdmin ? 'admin' : 'public'} route: ${routePath}`);
    }
  }

  // ✅ Load global routes from src/routes/
  if (fs.existsSync(globalRoutesPath)) {
    const globalRouteFiles = fs.readdirSync(globalRoutesPath)
      .filter(file => file.endsWith('.routes.js'));

    for (const file of globalRouteFiles) {
      const routeFileUrl = pathToFileURL(path.join(globalRoutesPath, file));
      const routeModule = await import(routeFileUrl.href);

      if (file === 'root.routes.js') {
        app.use('/', routeModule.default);
        console.log(`✅ Loaded root route: /`);
      } else {
        const routeName = file.replace('.routes.js', '');
        app.use(`/${routeName}`, routeModule.default);
        console.log(`✅ Loaded global route: /${routeName}`);
      }
    }
  } else {
    console.warn('⚠️  No global routes directory found at /src/routes/');
  }

  //GLOBAL DEFAULT PAGE NOT FOUND
  app.use((req, res, next) => {
    res.status(404);
    res.render('errors/404', { pageTitle: 'Page Not Found', url: `${req.protocol}://${req.get('host')}${req.originalUrl}` });
  });

  //GLOBAL DEFAULT INTERNAL SERVER ERROR
  app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.stack);
    res.status(500);
    res.render('errors/500', { pageTitle: 'Server Error', error: err });
  });
}
