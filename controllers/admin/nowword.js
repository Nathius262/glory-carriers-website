import pool from '../../config/databaseConfig.js';
import capitalizeWords from '../../utils/utils.js';
import cloudinary from '../../config/cloudinaryConfig.js';
import {getPublicIdFromUrl} from '../../utils/utils.js'


export const renderNowwordPage = async (req, res) => {
  return res.render('./admin/nowword/create', {pageTitle:"GCMI Admin"})
}

export const createNowwordAdmin = async (req, res) => {
  try {
    if (!req.files['file']) {
      return res.status(400).json({
        success: false,
        message: 'Missing required files',
      });
    }

    const fileResult = req.files['file'][0];
    const fileFileName = fileResult.originalname.split('.')[0];
    const title = capitalizeWords(fileFileName.replace(/-/g, ' '));

    const result = await pool.query('INSERT INTO nowword (title, file_url) VALUES ($1, $2)', [title, fileResult.path]);


    res.status(200).json({
      success: true,
      redirectTo: "/admin/nowword",
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
  
      res.render('./admin/nowword/list', {
        nowword: result.rows,
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: itemsPerPage,
        login:true,
        pageTitle:"GCMI Admin"
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
};

// Function to handle retrieving a single nowword by ID
export const getSingleNowwordAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM nowword WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Nowword not found');
    }
    res.render('./admin/nowword/update', { nowword: result.rows[0], pageTitle:"GCMI Admin" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const updateNowwordAdmin = async (req, res) => {

  const { id } = req.params;
  const { title } = req.body;
  const file = req.files?.['file'] ? req.files['file'][0].path : null;

  try {
      // Retrieve the current nowword details
      const currentNowword = await pool.query('SELECT file_url FROM nowword WHERE id = $1', [id]);
      
      if (currentNowword.rows.length === 0) {
          return res.status(404).send('Nowword not found');
      }

      const { file_url: currentFileUrl } = currentNowword.rows[0];

      if (file && currentFileUrl) {
        await cloudinary.uploader.destroy(getPublicIdFromUrl(currentFileUrl), { resource_type: 'video' });
      }

      // Update the nowword record in the database
      const result = await pool.query(
          `UPDATE nowword SET title = $1, 
          file_url = COALESCE($2, file_url)
          WHERE id = $3 RETURNING *`,
          [title, file, id]
      );

      if (result.rows.length === 0) {
          return res.status(404).send('Nowword not found');
      }

      // Redirect to the updated nowword page
      res.json({message:"updated successfully", redirectTo:false});
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
};
  
// Function to handle deleting a nowword by ID
export const deleteNowwordAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    // Retrieve the nowword details before deletion
    const nowword = await pool.query('SELECT file_url FROM nowword WHERE id = $1', [id]);

    if (nowword.rows.length === 0) {
      return res.status(404).send('Nowword not found');
    }

    const { file_url: fileUrl } = nowword.rows[0];


    // Delete the file and image files from Cloudinary
    if (fileUrl) {
      const filePublicId = getPublicIdFromUrl(fileUrl);
      const file = await cloudinary.uploader.destroy(filePublicId, { resource_type: 'video' }); // Specify the resource type as 'video' for file files
    }

    // Delete the nowword from the database
    const result = await pool.query('DELETE FROM nowword WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('Nowword not found');
    }

    // Redirect after deletion
    res.json({ message: "Nowword Deleted", redirectTo: "/admin/nowword" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
