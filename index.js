//main import
import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

//custom import
import {internalServerError, pageNotFound} from './middlewares/errorHandler.js'
import staticFiles from "./config/staticFiles.js"
import hbs from "./config/settings.js"
//import pathNormalizer from './middlewares/normalizer.js';
import rootRouter from "./routers/rootRouter.js"
import mediaRouter from "./routers/mediaRouter.js"


dotenv.config()

// Derive the equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const app = express();
//app.use(pathNormalizer);

//settings
app.engine('html', hbs.engine);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

//staticfiles
app.use(staticFiles);

// routes
app.use('/', rootRouter);
app.use('/media/', mediaRouter);

//middlewares
app.use(internalServerError);
app.use(pageNotFound);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
