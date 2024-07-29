import pool from '../config/databaseConfig.js';
import capitalizeWords from '../utils/utils.js';


// Function to handle adding a new sermon
export const createSermon = async (req, res) => {
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


    const result = await pool.query('INSERT INTO sermons (title, audio_url, image_url, video_url) VALUES ($1, $2, $3, $4)', [title, audioResult.path, imageResult.path, req.body.video_url]);

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


// Function to handle retrieving all sermons
export const getAllSermons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 12;
    const offset = (page - 1) * itemsPerPage;

    const result = await pool.query(
      'SELECT * FROM sermons ORDER BY date DESC LIMIT $1 OFFSET $2',
      [itemsPerPage, offset]
    );

    const totalResult = await pool.query('SELECT COUNT(*) FROM sermons');
    const totalItems = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    res.render('./sermons/media', {
      sermons: result.rows,
      currentPage: page,
      totalPages: totalPages,
      itemsPerPage: itemsPerPage
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Function to handle retrieving a single sermon by ID
export const getSermonById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM sermons WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Sermon not found');
    }
    res.render('mediaDetail', { sermon: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Function to handle updating a sermon by ID
export const updateSermon = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const audio = req.files['audio'] ? req.files['audio'][0].path : null;
  const image = req.files['image'] ? req.files['image'][0].path : null;

  try {
    const result = await pool.query(
      'UPDATE sermons SET title = $1, content = $2, audio_url = COALESCE($3, audio_url), image_url = COALESCE($4, image_url) WHERE id = $5 RETURNING *',
      [title, content, audio, image, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Sermon not found');
    }
    res.redirect(`/media/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Function to handle deleting a sermon by ID
export const deleteSermon = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM sermons WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Sermon not found');
    }
    res.redirect('/media');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
