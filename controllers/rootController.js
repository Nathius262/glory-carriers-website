import pool from "../config/databaseConfig.js";

// Derive the equivalent of __dirname
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const renderIndex= async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM sermons ORDER BY date DESC LIMIT $1 OFFSET $2',
            [2, 0]
        );

        //console.log(result.rows)
        res.render('index', {
            sermons: result.rows,
            pageTitle: "GCMI"
        });
    } catch (err) {
        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

const renderAbout = async (req, res) => {
    try {
        res.render('about', {pageTitle:"About GCMI"});
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderContact = async (req, res) => {
    try {
        res.render('contact', {pageTitle: "Contact"});
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderEvent= async (req, res) => {
    try {
        res.render('event', {pageTitle: "GCMI Events"});
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderDepartment = async (req, res) => {
    try {
        res.render('department', {pageTitle: "GCMI Department"});
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderGiving = async (req, res) => {
    try {
        res.render('giving', {pageTitle: "Giving"});
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderSitemap = async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '..', 'views', 'sitemap.xml'));
    } catch (error) {
        res.status(404).send('page not found');
    }
};



export {renderIndex, renderSitemap, renderAbout, renderContact, renderDepartment, renderEvent, renderGiving}