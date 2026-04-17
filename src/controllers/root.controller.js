import dotenv from 'dotenv';
import * as sermonService from '../modules/sermon/services/Sermon.service.js';
import { findAll as eventService } from '../modules/event/services/admin.Event.service.js';

// Derive the equivalent of __dirname
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();


const page_logo = process.env.PAGELOGO

export const index_view = async (req, res) => {
    try {

        const sermons = await sermonService.findAll({ limit: 6, offset: 0 });
        const events = await eventService({ limit: 1, offset: 0 });
        res.render('index', {
            pageTitle: "Home",
            pageLogo: page_logo,
            sermons: sermons.sermons,
            event: events.events[0]
        });
    } catch (err) {
        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

export const about_view = async (req, res) => {
    try {
        res.render('others/about', {
            pageTitle: "About",
            pageLogo: page_logo,
        });
    } catch (error) {
        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
}

export const sitemap_view = async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '..', 'views', 'others', 'sitemap.xml'));
    } catch (error) {
        res.status(404).send('Not found');
    }
};

export const ads_txt_view = async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '..', 'views', 'others', 'ads.txt'));
    } catch (error) {
        res.status(404).send('Not found');
    }
}

export const privacy_policy_view = async (req, res) => {
    try {
        res.render('others/privacy_policy', {
            pageTitle: "Privacy Policy",
            pageLogo: page_logo,
        });
    } catch (error) {
        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
}
