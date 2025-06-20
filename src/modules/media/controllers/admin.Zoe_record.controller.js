import * as service from '../services/admin.Zoe_record.service.js';

import capitalizeWords from '../../../utils/utils.js';
import {getPublicIdFromUrl} from '../../../utils/utils.js'
import cloudinary from '../../../config/cloudinaryConfig.js';


export const findAll = async (req, res) => {
  const {page, limit, offset} = req.pagination
  try {
    const data = await service.findAll({limit, offset});
    res.status(200).render('./zoe_record/admins/zoe_record_list', {
      success: true,
      pageTitle: "Admin",
      zoe_records: data.zoe_records,
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
    res.status(200).render('./zoe_record/admins/zoe_record_update', {
      success: true,
      pageTitle: "Update Record",
      zoe_record: data,
    });
  } catch (err) {
    res.status(404).render('errors/404', { error: err.message });
  }
};

export const create = async (req, res) => {
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

    const data = await service.create(req_data);

    res.status(201).json({ 
      success: true, 
      data 
    });

  } catch (err) {
    console.error('Create error:', err); // Log for debugging

    res.status(500).json({ 
      success: false, 
      message: 'Failed to create zoe_record',
      error: err.message 
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, video_url } = req.body;
    const audioFile = req.files?.['audio']?.[0];
    const imageFile = req.files?.['image']?.[0];

    // Find the existing zoe_record
    const zoe_record = await service.findById(id);
    if (!zoe_record) {
      return res.status(404).json({ success: false, message: "Zoe Record not found" });
    }

    const { audio_url: currentAudioUrl, image_url: currentImageUrl } = zoe_record;
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

    // Update the zoe_record
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

    const zoe_record = await service.findById(id);
    if (!zoe_record) {
      return res.status(404).json({ 
        success: false, 
        message: "Zoe Record not found" 
      });
    }

    const { audio_url: audioUrl, image_url: imageUrl } = zoe_record;

    

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
        message: "Cloudinary deletion failed (orphaned files may exist): "+ cloudinaryErr,
        error: err.message 
      });
    }

    const data = await service.destroy(id);

    res.status(200).json({ 
      success: true, 
      message: 'Deleted successfully', 
      data,
      redirectTo: "/admin/media/zoe-record"
    });

  } catch (err) {
    console.error("Delete error:", err); // Log for debugging
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete zoe_record",
      error: err.message 
    });
  }
};


export const renderCreate = async (req, res) => {
  try {
    res.status(200).render('./zoe_record/admins/zoe_record_create', {
      pageTitle: "Create Zoe Record"
    });
  } catch (err) {
    res.status(500).render('errors/500', { error: err.message });
  }
};