const fs = require('fs');
const path = require('path');

module.exports = function loadModules(app) {
  const modulesPath = path.join(process.cwd(), '../modules');
  const baseApiPath = '/api';

  // Read all module folders in /src/modules
  const modules = fs.readdirSync(modulesPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  modules.forEach(moduleName => {
    const routesDir = path.join(modulesPath, moduleName, 'routes');

    if (!fs.existsSync(routesDir)) return;

    const routeFiles = fs.readdirSync(routesDir)
      .filter(file => file.endsWith('.routes.js'));

    routeFiles.forEach(file => {
      const isAdmin = file.startsWith('admin.');
      const routePath = isAdmin
        ? `${baseApiPath}/admin/${moduleName}`
        : `${baseApiPath}/${moduleName}`;

      const routeModule = require(path.join(routesDir, file));
      app.use(routePath, routeModule);

      console.log(`✅ Loaded ${isAdmin ? 'admin' : 'public'} route: ${routePath}`);
    });
  });
};
