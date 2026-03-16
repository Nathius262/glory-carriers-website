const dotenv = require('dotenv');
dotenv.config()
module.exports = {
  development: {
    username: null, // SQLite doesn't require a username
    password: null, // SQLite doesn't require a password
    database: 'db.sqlite', // SQLite file name
    storage: './src/databases/db_test.sqlite', // Path to SQLite file
    dialect: 'sqlite',
    //logging: console.log,
    
  },
  test: {
    username: null,
    password: null,
    database: 'db_test.sqlite',
    storage: './src/databases/db_test.sqlite', // SQLite file path for testing
    dialect: 'sqlite'
  },
  production: {
    //IF YOUR HOSTING YOUR PROJECT ON VERCEL I'LL ADVICE TO USE URL BY UNCOMMENTING THE NEXT LINE
    url:process.env.POSTGRES_URL,

    //ELSE USE THIS CONFIG FOR OTHER PLATFORMS THAT REQUIRES THE FOLLOWING FIELDS
    username:process.env.POSTGRES_USER, // Replace with your PostgreSQL username
    password:process.env.POSTGRES_PASSWORD,   // Replace with your PostgreSQL password
    database: process.env.POSTGRES_DATABASE,
    host:process.env.POSTGRES_HOST, // Replace with your PostgreSQL host
    port:process.env.POSTGRES_PORT,  // Make sure the port is correct


    dialect:process.env.POSTGRES_DIALECT,
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: false,  // Make sure SSL is required if you're using a production server that needs it
        rejectUnauthorized: false  // If necessary, skip certificate verification
      },
      connectTimeout: 60000,
    },
    logging: false //console.log,    // Disable logging in production for performance
  }
}; 
