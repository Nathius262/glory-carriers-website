import pool from '../config/databaseConfig.js';

// Function to handle adding a new sermon
export const createSermon = async (req, res) => {
    console.log('Form data:', req);
    console.log('Form data received:', req.body);
    console.log('Form data received:', req.data);
    console.log('Files received:', req.files);
  
    // Handle file and form data processing
    try {
      // Perform your database operations or other logic here
      // For example:
      // const result = await pool.query('INSERT INTO sermons ...', [req.body.title, req.files['audio'][0].path, req.files['image'][0].path]);
  
      res.redirect('/media'); // Redirect after successful processing
    } catch (err) {
      console.error('Error:', err);
      res.status(500).send('Server Error');
    }
};
  

// Function to handle retrieving all sermons
export const getAllSermons = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sermons ORDER BY date DESC');
    console.log('data fetch')
    res.render('media', { sermons: result.rows });
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
