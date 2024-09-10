import pool from '../../config/databaseConfig.js';
import capitalizeWords from '../../utils/utils.js';
import cloudinary from '../../config/cloudinaryConfig.js';
import {getPublicIdFromUrl} from '../../utils/utils.js'


export const renderRecordsPage = async (req, res) => {
  return res.render('./admin/zoe_record/create', {pageTitle:"GCMI Admin"})
}

export const createRecordsAdmin = async (req, res) => {
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
      'INSERT INTO zoe_record (title, audio_url, image_url, video_url) VALUES ($1, $2, $3, $4)',
      [title, audioResult.path, imageResult.path, req.body.video_url]
    );

    res.status(200).json({
      success: true,
      redirectTo: "/admin/zoe-record",
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

// Function to handle retrieving all zoe_record
export const getAllRecordsAdmin = async (req, res) => {
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

    res.render('./admin/zoe_record/list', {
      zoe_record: result.rows,
      currentPage: page,
      totalPages: totalPages,
      itemsPerPage: itemsPerPage,
      login:true
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err });
  }
};

// Function to handle retrieving a single zoe_record by ID
export const getSingleRecordsAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM zoe_record WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Records not found');
    }
    res.render('./admin/zoe_record/update', { zoe_record: result.rows[0], pageTitle:"GCMI Admin" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const updateRecordsAdmin = async (req, res) => {

  const { id } = req.params;
  const { title, video_url } = req.body;
  const audio = req.files?.['audio'] ? req.files['audio'][0].path : null;
  const image = req.files?.['image'] ? req.files['image'][0].path : null;

  try {
      // Retrieve the current zoe_record details
      const currentRecords = await pool.query('SELECT audio_url, image_url FROM zoe_record WHERE id = $1', [id]);
      
      if (currentRecords.rows.length === 0) {
          return res.status(404).send('Records not found');
      }

      const { audio_url: currentAudioUrl, image_url: currentImageUrl } = currentRecords.rows[0];

      if (audio && currentAudioUrl) {
        await cloudinary.uploader.destroy(getPublicIdFromUrl(currentAudioUrl), { resource_type: 'video' });
      }

      // Check if new image is uploaded and delete the old one from Cloudinary
      if (image && currentImageUrl) {
        await cloudinary.uploader.destroy(getPublicIdFromUrl(currentImageUrl, { resource_type: 'image' }));
      }


      // Update the zoe_record record in the database
      const result = await pool.query(
          `UPDATE zoe_record SET title = $1, video_url = $2, 
          audio_url = COALESCE($3, audio_url), image_url = COALESCE($4, image_url) 
          WHERE id = $5 RETURNING *`,
          [title, video_url, audio, image, id]
      );

      if (result.rows.length === 0) {
          return res.status(404).send('Records not found');
      }

      // Redirect to the updated zoe_record page
      res.json({message:"updated successfully", redirectTo:false});
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
};
  
// Function to handle deleting a zoe_record by ID
export const deleteRecordsAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    // Retrieve the zoe_record details before deletion
    const zoe_record = await pool.query('SELECT audio_url, image_url FROM zoe_record WHERE id = $1', [id]);

    if (zoe_record.rows.length === 0) {
      return res.status(404).send('Records not found');
    }

    const { audio_url: audioUrl, image_url: imageUrl } = zoe_record.rows[0];


    // Delete the audio and image files from Cloudinary
    if (audioUrl) {
      const audioPublicId = getPublicIdFromUrl(audioUrl);
      const audio = await cloudinary.uploader.destroy(audioPublicId, { resource_type: 'video' }); // Specify the resource type as 'video' for audio files
    }

    if (imageUrl) {
      const imagePublicId = getPublicIdFromUrl(imageUrl);
      const image = await cloudinary.uploader.destroy(imagePublicId, { resource_type: 'image' }); // Specify the resource type as 'image' for images
    }


    // Delete the zoe_record from the database
    const result = await pool.query('DELETE FROM zoe_record WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('Records not found');
    }

    // Redirect after deletion
    res.json({ message: "Records Deleted", redirectTo: "/admin/zoe-record" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
