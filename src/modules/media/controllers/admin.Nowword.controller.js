import * as service from '../services/admin.Nowword.service.js';
import capitalizeWords from '../../../utils/utils.js';
import {getPublicIdFromUrl} from '../../../utils/utils.js'
import cloudinary from '../../../config/cloudinaryConfig.js';


export const findAll = async (req, res) => {
  const {page, limit, offset} = req.pagination
  try {
    const data = await service.findAll({limit, offset});
    res.status(200).render('./nowword/admins/nowword_list', {
      success: true,
      pageTitle: "Admin",
      nowwords: data.nowwords,
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      currentPage: page
    });
  } catch (err) {
    console.log(err)
    res.status(500).render('errors/500', { error: err.message });
  }
};

export const findById = async (req, res) => {
  try {
    const data = await service.findById(req.params.id);
    res.status(200).render('./nowword/admins/nowword_update', {
      success: true,
      pageTitle: "Update Record",
      nowword: data,
    });
  } catch (err) {
    res.status(404).render('errors/404', { error: err.message });
  }
};

export const create = async (req, res) => {
  try {
    if (!req.files || !req.files['file']) {
      return res.status(400).json({
        success: false,
        message: 'Missing required files (file)',
      });
    }

    const pdfFile = req.files['file'][0];

    const allowedPdfTypes = ['file/pdf'];

    if (!allowedPdfTypes.includes(pdfFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file file type (only pdf allowed)',
      });
    }

  

    const pdfNameParts = pdfFile.originalname.split('.');
    const baseName = pdfNameParts[0] || 'untitled'; // Fallback if no extension
    const formattedTitle = capitalizeWords(baseName.replace(/-/g, ' '));

    const req_data = {
      title: formattedTitle,
      file_url: pdfFile.path
    };

    const data = await service.create(req_data);

    res.status(201).json({ 
      success: true, 
      data 
    });

  } catch (err) {
    console.error('Create error:', err); // Log for debugging

    res.status(500).json({ 
      success: false, 
      message: 'Failed to create nowword',
      error: err.message 
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const pdfFile = req.files?.['file']?.[0];

    // Find the existing nowword
    const nowword = await service.findById(id);
    if (!nowword) {
      return res.status(404).json({ success: false, message: "Sermon not found" });
    }

    const { file_url: currentPdfUrl } = nowword;
    const updates = { title };

    try {
      // Handle file file update
      if (pdfFile) {
        updates.file_url = pdfFile.path;
        if (currentPdfUrl) {
          await cloudinary.uploader.destroy(
            getPublicIdFromUrl(currentPdfUrl), 
            { resource_type: 'video' }
          );
        }
      }

    } catch (cloudinaryErr) {
      console.error('Cloudinary error:', cloudinaryErr);
      return res.status(500).json({ 
        success: false, 
        message: "Error updating media files" 
      });
    }

    // Check if any updates are being made
    if (!Object.values(updates).some(val => val !== undefined)) {
      return res.status(400).json({ 
        success: false, 
        message: "No valid fields provided for update" 
      });
    }

    // Update the nowword
    const data = await service.update(id, updates);
    res.status(200).json({ success: true, data });

  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message || "Internal server error" 
    });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params; // Extract id from params

    const nowword = await service.findById(id);
    if (!nowword) {
      return res.status(404).json({ 
        success: false, 
        message: "Sermon not found" 
      });
    }

    const { file_url: pdfUrl } = nowword;

    

    try {
      if (pdfUrl) {
        const audioPublicId = getPublicIdFromUrl(pdfUrl);
        await cloudinary.uploader.destroy(audioPublicId, { 
          resource_type: 'video' 
        });
      }

     
    } catch (cloudinaryErr) {
      console.error("Cloudinary deletion failed (orphaned files may exist):", cloudinaryErr);
      res.status(500).json({ 
        success: false, 
        message: "Cloudinary deletion failed (orphaned files may exist): "+ cloudinaryErr,
        error: err.message 
      });
    }

    const data = await service.destroy(id);

    res.status(200).json({ 
      success: true, 
      message: 'Deleted successfully', 
      data,
      redirectTo: "/admin/nowword"
    });

  } catch (err) {
    console.error("Delete error:", err); // Log for debugging
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete nowword",
      error: err.message 
    });
  }
};


export const renderCreate = async (req, res) => {
  try {
    res.status(200).render('./nowword/admins/nowword_create', {
      pageTitle: "Create Sermon"
    });
  } catch (err) {
    res.status(500).render('errors/500', { error: err.message });
  }
};