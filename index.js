//main import
import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import bodyParser from 'body-parser';


//custom import
import {internalServerError, pageNotFound} from './middlewares/errorHandler.js'
import staticFiles from "./config/staticFiles.js"
import hbs from "./config/settings.js"
import removeTrailingSlash  from './middlewares/normalizer.js';
import rootRouter from "./routers/rootRouter.js"
import mediaRouter from "./routers/mediaRouter.js"
import authRouter from './routers/authRouter.js'

//import crypto from 'crypto';
//const secretKey = crypto.randomBytes(64).toString('hex');


dotenv.config()

// Derive the equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const app = express();
app.use(removeTrailingSlash );

//settings
app.engine('html', hbs.engine);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON bodies
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
//app.use(multer().array())

//staticfiles
app.use(staticFiles);

// routes
app.use('/', rootRouter);
app.use('/auth/', authRouter);
app.use('/media/', mediaRouter);

//middlewares\
app.use(pageNotFound);
app.use(internalServerError);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  
  //console.log(secretKey);

});
