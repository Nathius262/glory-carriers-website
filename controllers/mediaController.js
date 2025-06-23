import {searchSermon, searchZoeRecord, searchNowword} from './searchController.js'
import pool from '../config/databaseConfig.js';
import dotenv from 'dotenv';


dotenv.config();

const page_logo = process.env.PAGELOGO

// Function to handle retrieving all sermons
export const getAllSermons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 12;
    const offset = (page - 1) * itemsPerPage;

    const result = await pool.query(
      'SELECT * FROM sermons ORDER BY "createdAt" DESC LIMIT $1 OFFSET $2',
      [itemsPerPage, offset]
    );

    const totalResult = await pool.query('SELECT COUNT(*) FROM sermons');
    const totalItems = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    res.render('./media/sermon', {
      sermons: result.rows,
      currentPage: page,
      totalPages: totalPages,
      itemsPerPage: itemsPerPage,
      search:true,
      login:true,
      pageTitle: "Sermons",
      pageLogo: page_logo
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err });
  }
};

// Function to handle retrieving a single sermon by ID and the latest 4 sermons
export const getSingleSermon = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the sermon by ID and the latest 4 sermons in parallel
    const sermonQuery = pool.query('SELECT * FROM sermons WHERE id = $1', [id]);
    const latestSermonsQuery = pool.query('SELECT * FROM sermons ORDER BY "createdAt" DESC LIMIT 5');

    // Await both queries
    const [sermonResult, latestSermonsResult] = await Promise.all([sermonQuery, latestSermonsQuery]);

    // If the sermon by ID is not found
    if (sermonResult.rows.length === 0) {
      return res.status(404).send('Sermon not found');
    }

    // Extract the sermon by ID
    const sermon = sermonResult.rows[0];

    // Filter out the sermon by ID from the latest sermons
    const filteredLatestSermons = latestSermonsResult.rows.filter(latestSermon => latestSermon.id !== sermon.id);

    // Render the single sermon page, passing the sermon by ID and the filtered latest sermons
    res.render('./media/single_sermon.html', {
      sermon,                                // The sermon fetched by ID
      latestSermons: filteredLatestSermons,  // The latest 4 sermons excluding the current one
      pageTitle: sermon.title,               // Set the page title to the sermon title
      pageLogo: sermon.image_url
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};



// Function to handle retrieving all nowword
export const getAllNowword = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 12;
    const offset = (page - 1) * itemsPerPage;

    const result = await pool.query(
      'SELECT * FROM nowword ORDER BY "createdAt" DESC LIMIT $1 OFFSET $2',
      [itemsPerPage, offset]
    );

    const totalResult = await pool.query('SELECT COUNT(*) FROM nowword');
    const totalItems = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    res.render('./media/now_word', {
      nowword: result.rows,
      currentPage: page,
      totalPages: totalPages,
      itemsPerPage: itemsPerPage,
      search:true,
      login:true,
      pageTitle: "Now word",
      pageLogo: page_logo
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Function to handle retrieving all zoe_record
export const getAllZoeRecord = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 12;
    const offset = (page - 1) * itemsPerPage;

    const result = await pool.query(
      'SELECT * FROM zoe_record ORDER BY "createdAt" DESC LIMIT $1 OFFSET $2',
      [itemsPerPage, offset]
    );

    const totalResult = await pool.query('SELECT COUNT(*) FROM zoe_record');
    const totalItems = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    res.render('./media/zoe_record', {
      zoe_record: result.rows,
      currentPage: page,
      totalPages: totalPages,
      itemsPerPage: itemsPerPage,
      search:true,
      login:true,
      pageTitle:"Zoe Record",
      pageLogo: page_logo
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const renderStream = async (req, res) => {
    try {
        res.render('stream', {pageTitle: "Stream", pageLogo: page_logo});
    } catch (error) {
        res.status(404).send('page not found');
    }
};

export const renderSearch = async (req, res) => {
    try {
      const [sermonData, zoeRecordData, nowwordData] = await Promise.all([
        searchSermon(req),
        searchZoeRecord(req),
        searchNowword(req),
      ]);
  
      // Combine data and render template
      res.render('search', {
        sermonData,
        zoeRecordData,
        nowwordData,
        pageTitle: "GCMI",
        pageLogo: page_logo
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
};
