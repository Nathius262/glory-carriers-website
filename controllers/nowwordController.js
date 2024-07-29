import pool from '../config/databaseConfig.js';
import capitalizeWords from '../utils/utils.js';


// Function to handle adding a new sermon
export const newNowword = async (req, res) => {
  try {

    // Check if the files are received
    if (!req.files['file']) {
      return res.status(400).json({
        success: false,
        message: 'Missing required files',
      });
    }

    // Get the Cloudinary results from the files
    const fileResult = req.files['file'][0];

    const fileFileName = fileResult.originalname.split('.')[0]; // Get the file name without extension

    // Capitalize each word of the file file name and use it as the title
    const title = capitalizeWords(fileFileName.replace(/-/g, ' ')); // Replace hyphens with spaces


    const result = await pool.query('INSERT INTO nowword (title, file_url) VALUES ($1, $2)', [title, fileResult.path]);

    res.status(200).json({
      success: true,
      message: 'Uploaded successfully',
      
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      data: err,
    });
  }
};


// Function to handle retrieving all nowword
export const getAllNowword = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 12;
    const offset = (page - 1) * itemsPerPage;

    const result = await pool.query(
      'SELECT * FROM nowword ORDER BY date DESC LIMIT $1 OFFSET $2',
      [itemsPerPage, offset]
    );

    const totalResult = await pool.query('SELECT COUNT(*) FROM nowword');
    const totalItems = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    res.render('nowword/now_word', {
      nowword: result.rows,
      currentPage: page,
      totalPages: totalPages,
      itemsPerPage: itemsPerPage
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
