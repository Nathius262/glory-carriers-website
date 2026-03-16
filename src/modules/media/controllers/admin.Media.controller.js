import * as service from '../services/admin.Media.service.js';
import capitalizeWords from '../../../utils/utils.js';
import { getPublicIdFromUrl } from '../../../utils/utils.js'
import cloudinary from '../../../config/cloudinaryConfig.js';

/* ********
 * ********
 * NOW WORD
 * ********
 * *******/
export const findAllNowwords = async (req, res) => {
  const { page, limit, offset } = req.pagination
  try {
    const data = await service.findAllNowwords({ limit, offset });
    res.status(200).render('./nowword/admins/nowword_list', {
      success: true,
      layout: "admin",
      pageTitle: "Admin - Nowwords",
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

export const findByIdNowword = async (req, res) => {
  try {
    const data = await service.findByIdNowword(req.params.id);
    res.status(200).render('./nowword/admins/nowword_update', {
      success: true,
      layout: "admin",
      pageTitle: "Update Record",
      nowword: data,
    });
  } catch (err) {
    res.status(404).render('errors/404', { error: err.message });
  }
};

export const createNowword = async (req, res) => {
  try {
    if (!req.files || !req.files['file']) {
      return res.status(400).json({
        success: false,
        message: 'Missing required files (file)',
      });
    }

    const pdfFile = req.files['file'][0];

    const allowedPdfTypes = ['application/pdf'];

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

    const data = await service.createNowword(req_data);

    res.status(201).json({
      success: true,
      redirectTo: "/admin/media/nowword/create",
      message: "Created successfully",
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

export const updateNowword = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const pdfFile = req.files?.['file']?.[0];

    // Find the existing nowword
    const nowword = await service.findByIdNowword(id);
    if (!nowword) {
      return res.status(404).json({ success: false, message: "Nowword not found" });
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
    const data = await service.updateNowword(id, updates);
    res.status(200).json({
      success: true,
      redirectTo: `/admin/media/nowword/${id}`, message: "Updated successfully",
      data
    });

  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error"
    });
  }
};

export const destroyNowword = async (req, res) => {
  try {
    const { id } = req.params; // Extract id from params

    const nowword = await service.findByIdNowword(id);
    if (!nowword) {
      return res.status(404).json({
        success: false,
        message: "Nowword not found"
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
        message: "Cloudinary deletion failed (orphaned files may exist): " + cloudinaryErr,
        error: err.message
      });
    }

    const data = await service.destroyNowword(id);

    res.status(200).json({
      success: true,
      message: 'Deleted successfully',
      data,
      redirectTo: "/admin/media/nowword"
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


export const renderCreateNowword = async (req, res) => {
  try {
    res.status(200).render('./nowword/admins/nowword_create', {
      pageTitle: "Create Nowword",
      layout: "admin",
    });
  } catch (err) {
    res.status(500).render('errors/500', { error: err.message });
  }
};

/* ********
 * ********
 * ZOE RECORD
 * ********
 * *******/

export const findAllZoeRecord = async (req, res) => {
  const { page, limit, offset } = req.pagination
  try {
    const data = await service.findAllZoeRecords({ limit, offset });
    res.status(200).render('./zoe_record/admins/zoe_record_list', {
      success: true,
      layout: "admin",
      PageTitle: "Admin - Zoe Records",
      zoe_records: data.zoe_records,
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      currentPage: page
    });
  } catch (err) {
    console.log(err)
    res.status(500).render('errors/500', { error: err });
  }
};

export const findByIdZoeRecord = async (req, res) => {
  try {
    const data = await service.findByIdZoeRecords(req.params.id);
    res.status(200).render('./zoe_record/admins/zoe_record_update', {
      success: true,
      pageTitle: "Admin - Update Record",
      layout: "admin",
      zoe_record: data,
    });
  } catch (err) {
    console.log(err)
    res.status(404).render('errors/404', { error: err });
  }
};

export const createZoeRecord = async (req, res) => {
  try {

    if (!req.files || !req.files['audio'] || !req.files['image']) {
      return res.status(400).json({
        success: false,
        message: 'Missing required files (audio and image)',
      });
    }

    const audioFile = req.files['audio'][0];
    const imageFile = req.files['image'][0];

    const allowedAudioTypes = ['audio/mpeg', 'audio/wav'];
    const allowedImageTypes = ['image/jpeg', 'image/png'];

    if (!allowedAudioTypes.includes(audioFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid audio file type (only MP3/WAV allowed)',
      });
    }

    if (!allowedImageTypes.includes(imageFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image file type (only JPEG/PNG allowed)',
      });
    }

    const audioNameParts = audioFile.originalname.split('.');
    const baseName = audioNameParts[0] || 'untitled'; // Fallback if no extension
    const formattedTitle = capitalizeWords(baseName.replace(/-/g, ' '));

    const req_data = {
      title: formattedTitle,
      audio_url: audioFile.path,
      image_url: imageFile.path,
      video_url: req.body.video_url || null, // Handle optional video
    };

    const data = await service.createZoeRecords(req_data);
    res.status(201).json({
      success: true,
      layout: "admin", redirectTo: "/admin/media/zoe-record", message: "Created successfully"
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

export const updateZoeRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, video_url } = req.body;
    const audioFile = req.files?.['audio']?.[0];
    const imageFile = req.files?.['image']?.[0];

    // Find the existing sermon
    const sermon = await service.findByIdZoeRecords(id);
    if (!sermon) {
      return res.status(404).json({ success: false, message: "Zoe record not found" });
    }

    const { audio_url: currentAudioUrl, image_url: currentImageUrl } = sermon;
    const updates = { title, video_url };

    try {
      // Handle audio file update
      if (audioFile) {
        updates.audio_url = audioFile.path;
        if (currentAudioUrl) {
          await cloudinary.uploader.destroy(
            getPublicIdFromUrl(currentAudioUrl),
            { resource_type: 'video' }
          );
        }
      }

      // Handle image file update
      if (imageFile) {
        updates.image_url = imageFile.path;
        if (currentImageUrl) {
          await cloudinary.uploader.destroy(
            getPublicIdFromUrl(currentImageUrl),
            { resource_type: 'image' }
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

    // Update the sermon
    const data = await service.updateZoeRecords(id, updates);
    res.status(200).json({
      success: true,
      data, redirectTo: `/admin/media/zoe-record/${req.params.id}`, message: "Updated successfully"
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

export const destroyZoeRecord = async (req, res) => {
  try {
    const { id } = req.params; // Extract id from params

    const sermon = await service.findByIdZoeRecords(id);
    if (!sermon) {
      return res.status(404).json({
        success: false,
        message: "Zoe record not found"
      });
    }

    const { audio_url: audioUrl, image_url: imageUrl } = sermon;



    try {
      if (audioUrl) {
        const audioPublicId = getPublicIdFromUrl(audioUrl);
        await cloudinary.uploader.destroy(audioPublicId, {
          resource_type: 'video'
        });
      }

      if (imageUrl) {
        const imagePublicId = getPublicIdFromUrl(imageUrl);
        await cloudinary.uploader.destroy(imagePublicId, {
          resource_type: 'image'
        });
      }
    } catch (cloudinaryErr) {
      console.error("Cloudinary deletion failed (orphaned files may exist):", cloudinaryErr);
      res.status(500).json({
        success: false,
        message: "Cloudinary deletion failed (orphaned files may exist): " + cloudinaryErr,
        error: err.message
      });
    }

    const data = await service.destroyZoeRecords(id);
    res.status(200).json({
      success: true,
      message: 'Deleted successfully', redirectTo: "/admin/media/zoe-record"
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

export const renderCreateZoeRecord = async (req, res) => {
  try {
    res.status(200).render('./zoe_record/admins/zoe_record_create', {
      pageTitle: "Admin - Create Zoe Record",
      layout: "admin",
    });
  } catch (err) {
    console.log(err)
    res.status(500).render('errors/500', { error: err });
  }
};