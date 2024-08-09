import pool from '../config/databaseConfig.js';

const renderStream = async (req, res) => {
    try {
        res.render('stream');
    } catch (error) {
        res.status(404).send('page not found');
    }
};


const renderSearch = async (req, res) => {
    try {
      const searchTerm = req.query.search || '';
      const sermonPage = parseInt(req.query.sermonPage) || 1;
      const itemsPerPage = parseInt(req.query.itemsPerPage) || 12;
      const offset = (sermonPage - 1) * itemsPerPage;
  
      const sermonResult = await pool.query(
        `
        SELECT * FROM sermons 
        WHERE title ILIKE $1
        ORDER BY date DESC 
        LIMIT $2 OFFSET $3
        `,
        [`%${searchTerm}%`, itemsPerPage, offset]
      );
  
      const totalSermonResult = await pool.query(
        `
        SELECT COUNT(*) FROM sermons 
        WHERE title ILIKE $1
        `,
        [`%${searchTerm}%`]
      );
  
      const totalSermonItems = parseInt(totalSermonResult.rows[0].count);
      const totalSermonPages = Math.ceil(totalSermonItems / itemsPerPage);
  
      res.render('search', {
        sermons: sermonResult.rows,
        sermonCurrentPage: sermonPage,
        totalSermonPages: totalSermonPages,
        itemsPerPage: itemsPerPage,
        searchTerm: searchTerm // Pass the search term back to the template
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };
  

export {renderStream, renderSearch}