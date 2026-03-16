const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const configFile = require('../core/sequelize.config.cjs'); // Adjust based on your config

const env = process.env.NODE_ENV || 'development';
const config = configFile[env];



if (!config) {
  throw new Error(`No Sequelize config found for environment: "${env}"`);
}

const db = {};


// Initialize Sequelize
const sequelize = new Sequelize(config);

// Helper: recursively collect all model files in modules/**/models/*.cjs|.js
function collectModelFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(collectModelFiles(fullPath));
    } else if (
      entry.isFile() &&
      (entry.name.endsWith('.cjs') || entry.name.endsWith('.js')) &&
      fullPath.includes(`${path.sep}models${path.sep}`)
    ) {
      results.push(fullPath);
    }
  }

  return results;
}

// Start from /src/modules
const modulesPath = path.join(__dirname, '..', 'modules');
const modelFiles = collectModelFiles(modulesPath);

// Load models
modelFiles.forEach(file => {
  const model = require(file)(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
