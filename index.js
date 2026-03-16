// app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import session from "express-session";
import flash from "connect-flash";

import loadModules from './src/config/load_modules.js';
import staticFiles from "./src/config/staticFiles.js";
import configureViewEngine from './src/config/viewEngine.js';
import eventLogger from './src/middlewares/logger.middleware.js';
import conditionalRendering from './src/middlewares/conditionalRender.middleware.js';
import { active_page } from './src/middlewares/activePage.js';
import { authorizeByPrefix } from './src/middlewares/rolePrefix.middleware.js';
import { attachUser } from './src/middlewares/auth.middleware.js';
dotenv.config();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Setup Handlebars view engine
configureViewEngine(app);

// Middleware: cookies + parsing
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ⚡ Session must come BEFORE flash
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// ⚡ Flash depends on session
app.use(flash());

// ⚡ Make flash available globally (must come after flash())
app.use((req, res, next) => {
  res.locals.messages = {
    success: req.flash("success"),
    error: req.flash("error"),
    info: req.flash("info"),
    warning: req.flash("warning"),
  };
  next();
});

// ⚡ Attach user AFTER session/flash so it can set flash messages if needed
app.use(attachUser);

// Now the rest
app.use(eventLogger);
app.use(staticFiles);
app.use(authorizeByPrefix);
app.use(conditionalRendering);
app.use(active_page);

// Load dynamic routes
await loadModules(app);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


export default app;
