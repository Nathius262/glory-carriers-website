import dotenv from 'dotenv';
import * as sermonService from '../modules/sermon/services/Sermon.service.js';

// Derive the equivalent of __dirname
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();


const page_logo = process.env.PAGELOGO

const renderIndex= async (req, res) => {
    try {

        const sermons = await sermonService.findAll({limit:2, offset:0});
        //console.log(result.rows)
        res.render('index', {
            pageTitle: "Home",
            pageLogo: page_logo,
            sermons: sermons.sermons
        });
    } catch (err) {
        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};


export {renderIndex}