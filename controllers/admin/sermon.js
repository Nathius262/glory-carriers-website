import pool from '../../config/databaseConfig.js';
import capitalizeWords from '../../utils/utils.js';
import { verifyToken, isAdmin } from '../../middlewares/auth.js';

export const renderSermonPage = async (req, res) => {
  return res.render('./admin/sermon/create')
}

export const createSermonAdmin = async (req, res) => {
  try {
    if (!req.files['audio'] || !req.files['image']) {
      return res.status(400).json({
        success: false,
        message: 'Missing required files',
      });
    }

    const audioResult = req.files['audio'][0];
    const imageResult = req.files['image'][0];
    const audioFileName = audioResult.originalname.split('.')[0];
    const title = capitalizeWords(audioFileName.replace(/-/g, ' '));

    const result = await pool.query(
      'INSERT INTO sermons (title, audio_url, image_url, video_url) VALUES ($1, $2, $3, $4)',
      [title, audioResult.path, imageResult.path, req.body.video_url]
    );

    res.status(200).json({
      success: true,
      redirectTo: "/admin/sermon",
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
}

// Function to handle retrieving all sermons
export const getAllSermonsAdmin = async (req, res) => {
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

    res.render('./admin/sermon/list', {
      sermons: result.rows,
      currentPage: page,
      totalPages: totalPages,
      itemsPerPage: itemsPerPage,
      search:true,
      login:true
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err });
  }
};

// Function to handle retrieving a single sermon by ID
export const getSingleSermonAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM sermons WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Sermon not found');
    }
    res.render('./admin/sermon/update', { sermon: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const updateSermonAdmin = async (req, res) => {
  console.log(req.body)
  console.log(req.files)
  const { id } = req.params;
  const { title, video_url } = req.body;
  const audio = req.files?.['audio'] ? req.files['audio'][0].path : null;
  const image = req.files?.['image'] ? req.files['image'][0].path : null;

  try {
      // Retrieve the current sermon details
      const currentSermon = await pool.query('SELECT audio_url, image_url FROM sermons WHERE id = $1', [id]);
      
      if (currentSermon.rows.length === 0) {
          return res.status(404).send('Sermon not found');
      }

      const { audio_url: currentAudioUrl, image_url: currentImageUrl } = currentSermon.rows[0];

      // Check if new audio is uploaded and delete the old one from Cloudinary
      if (audio && currentAudioUrl) {
          await cloudinary.v2.uploader.destroy(getPublicIdFromUrl(currentAudioUrl), { resource_type: 'video' });
      }

      // Check if new image is uploaded and delete the old one from Cloudinary
      if (image && currentImageUrl) {
          await cloudinary.v2.uploader.destroy(getPublicIdFromUrl(currentImageUrl));
      }

      // Update the sermon record in the database
      const result = await pool.query(
          `UPDATE sermons SET title = $1, video_url = $2, 
          audio_url = COALESCE($3, audio_url), image_url = COALESCE($4, image_url) 
          WHERE id = $5 RETURNING *`,
          [title, video_url, audio, image, id]
      );

      if (result.rows.length === 0) {
          return res.status(404).send('Sermon not found');
      }

      // Redirect to the updated sermon page
      res.redirect(`/admin/sermon/${id}`);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
};
  
// Function to handle deleting a sermon by ID
export const deleteSermonAdmin = async (req, res) => {
    const { id } = req.params;
    try {
      // Retrieve the sermon details before deletion
      const sermon = await pool.query('SELECT audio_url, image_url FROM sermons WHERE id = $1', [id]);
  
      if (sermon.rows.length === 0) {
        return res.status(404).send('Sermon not found');
      }
  
      const { audio_url: audioUrl, image_url: imageUrl } = sermon.rows[0];
  
      // Delete the sermon from the database
      const result = await pool.query('DELETE FROM sermons WHERE id = $1 RETURNING *', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).send('Sermon not found');
      }
  
      // Delete the audio and image files from Cloudinary
      if (audioUrl) {
        await cloudinary.v2.uploader.destroy(getPublicIdFromUrl(audioUrl), { resource_type: 'video' });
      }
      if (imageUrl) {
        await cloudinary.v2.uploader.destroy(getPublicIdFromUrl(imageUrl));
      }
  
      // Redirect after deletion
      res.redirect('/admin/sermon');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
};

// Helper function to extract the public ID from a Cloudinary URL
const getPublicIdFromUrl = (url) => {
    const urlParts = url.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0];
    return `${urlParts[urlParts.length - 2]}/${publicId}`;
};
