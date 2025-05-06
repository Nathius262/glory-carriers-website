const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const configFile = require('../core/sequelize.config.cjs'); // Adjust based on your config

const basename = path.basename(__filename);
const env = process.env.NODE_ENV;
const config = configFile[env];

const db = {};

// Initialize Sequelize
const sequelize = new Sequelize(config.database, config.username, config.password, config,
  {define: {
    underscored: false, // Disable automatic snake_case conversion
  },}
);

const modelFiles = fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.endsWith('.cjs') || file.endsWith('.js'));
  });


// Load models
modelFiles.forEach(file => {
  const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  db[model.name] = model; // Store the model in the db object
});

// Setup associations if any
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add sequelize and Sequelize to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;