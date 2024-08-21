import pool from '../config/databaseConfig.js';
import capitalizeWords from '../utils/utils.js';


// Function to handle adding a new sermon
export const newZoeRecord = async (req, res) => {
    try {
  
      // Check if the files are received
      if (!req.files['audio'] || !req.files['image']) {
        return res.status(400).json({
          success: false,
          message: 'Missing required files',
        });
      }
  
      // Get the Cloudinary results from the files
      const audioResult = req.files['audio'][0];
      const imageResult = req.files['image'][0];
  
      const audioFileName = audioResult.originalname.split('.')[0]; // Get the file name without extension
  
      // Capitalize each word of the audio file name and use it as the title
      const title = capitalizeWords(audioFileName.replace(/-/g, ' ')); // Replace hyphens with spaces
  
  
      const result = await pool.query('INSERT INTO zoe_record (title, audio_url, image_url, video_url) VALUES ($1, $2, $3, $4)', [title, audioResult.path, imageResult.path, req.body.video_url]);
  
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
  
  
  // Function to handle retrieving all zoe_record
  export const getAllZoeRecord = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const itemsPerPage = parseInt(req.query.itemsPerPage) || 12;
      const offset = (page - 1) * itemsPerPage;
  
      const result = await pool.query(
        'SELECT * FROM zoe_record ORDER BY date DESC LIMIT $1 OFFSET $2',
        [itemsPerPage, offset]
      );
  
      const totalResult = await pool.query('SELECT COUNT(*) FROM zoe_record');
      const totalItems = parseInt(totalResult.rows[0].count);
      const totalPages = Math.ceil(totalItems / itemsPerPage);
  
      res.render('./zoe_record/zoe_record', {
        zoe_record: result.rows,
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: itemsPerPage,
        search:true,
        login:true
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };