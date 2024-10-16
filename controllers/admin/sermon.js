import pool from '../../config/databaseConfig.js';
import capitalizeWords from '../../utils/utils.js';
import cloudinary from '../../config/cloudinaryConfig.js';
import {getPublicIdFromUrl} from '../../utils/utils.js'


export const renderSermonPage = async (req, res) => {
  return res.render('./admin/sermon/create', {pageTitle:"GCMI Admin"})
}

export const renderMultipleForm = async (req, res) => {
  return res.render('./admin/sermon/uploadmultiple', {pageTitle:"GCMI Admin"})
}

export const createMultipleSermonsAdmin = async (req, res) => {
  try {
    // Check if audio and image files are present
    if (!req.files['audio'] || !req.files['image']) {
      return res.status(400).json({
        success: false,
        message: 'Missing required files',
      });
    }

    // Handle multiple file uploads
    const audioFiles = req.files['audio']; // An array of audio files
    const imageFiles = req.files['image']; // An array of image files
    const videoUrls = req.body.video_url;  // This would be an array if needed

    const queries = [];
    for (let i = 0; i < audioFiles.length; i++) {
      const audio = audioFiles[i];
      const image = imageFiles[i];

      const audioFileName = audio.originalname.split('.')[0];
      const title = capitalizeWords(audioFileName.replace(/-/g, ' '));

      const query = pool.query(
        'INSERT INTO sermons (title, audio_url, image_url, video_url) VALUES ($1, $2, $3, $4)',
        [title, audio.path, image.path, req.body.video_url ? req.body.video_url[i] : null]
      );
      queries.push(query);
    }

    // Execute all queries
    await Promise.all(queries);

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
};


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
      login:true,
      pageTitle:"GCMI Admin"
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
    res.render('./admin/sermon/update', { sermon: result.rows[0], pageTitle:"GCMI Admin" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const updateSermonAdmin = async (req, res) => {

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

      if (audio && currentAudioUrl) {
        await cloudinary.uploader.destroy(getPublicIdFromUrl(currentAudioUrl), { resource_type: 'video' });
      }

      // Check if new image is uploaded and delete the old one from Cloudinary
      if (image && currentImageUrl) {
        await cloudinary.uploader.destroy(getPublicIdFromUrl(currentImageUrl, { resource_type: 'image' }));
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
      res.json({message:"updated successfully", redirectTo:false});
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


    // Delete the audio and image files from Cloudinary
    if (audioUrl) {
      const audioPublicId = getPublicIdFromUrl(audioUrl);
      const audio = await cloudinary.uploader.destroy(audioPublicId, { resource_type: 'video' }); // Specify the resource type as 'video' for audio files
    }

    if (imageUrl) {
      const imagePublicId = getPublicIdFromUrl(imageUrl);
      const image = await cloudinary.uploader.destroy(imagePublicId, { resource_type: 'image' }); // Specify the resource type as 'image' for images
    }


    // Delete the sermon from the database
    const result = await pool.query('DELETE FROM sermons WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('Sermon not found');
    }

    // Redirect after deletion
    res.json({ message: "Sermon Deleted", redirectTo: "/admin/sermon" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
