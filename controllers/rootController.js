import pool from "../config/databaseConfig.js";

const renderIndex= async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM sermons ORDER BY date DESC LIMIT $1 OFFSET $2',
            [2, 2]
        );

        //console.log(result.rows)
        res.render('index', {
            sermons: result.rows,
        });
    } catch (err) {
        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

const renderAbout = async (req, res) => {
    try {
        res.render('about');
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderContact = async (req, res) => {
    try {
        res.render('contact');
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderEvent= async (req, res) => {
    try {
        res.render('event');
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderDepartment = async (req, res) => {
    try {
        res.render('department');
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderGiving = async (req, res) => {
    try {
        res.render('giving');
    } catch (error) {
        res.status(404).send('page not found');
    }
};

export {renderIndex, renderAbout, renderContact, renderDepartment, renderEvent, renderGiving}