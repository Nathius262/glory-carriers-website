import express from 'express';
import path from 'path';


const app = express()


app.use((req, res, next) =>{
    if (req.path.substr(-1) === '/' && req.path.endsWith('/')){        
        req.url = req.url.slice(0, -1);
    }
    next();

});

export default app;