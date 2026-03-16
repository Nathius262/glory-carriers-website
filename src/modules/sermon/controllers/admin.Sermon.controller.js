import * as service from '../services/admin.Sermon.service.js';
import capitalizeWords from '../../../utils/utils.js';
import { getPublicIdFromUrl } from '../../../utils/utils.js'
import cloudinary from '../../../config/cloudinaryConfig.js';

export const findAll = async (req, res) => {
  const { page, limit, offset } = req.pagination
  try {
    const data = await service.findAll({ limit, offset });
    res.status(200).render('./admins/sermon_list', {
      success: true,
      layout: "admin",
      PageTitle: "Admin - Sermons",
      sermons: data.sermons,
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      currentPage: page
    });
  } catch (err) {
    console.log(err)
    res.status(500).render('errors/500', { error: err });
  }
};

export const findById = async (req, res) => {
  try {
    const data = await service.findById(req.params.id);
    res.status(200).render('./admins/sermon_update', {
      success: true,
      pageTitle: "Admin - Update Record",
      layout: "admin",
      sermon: data,
    });
  } catch (err) {
    console.log(err)
    res.status(404).render('errors/404', { error: err });
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
    res.status(201).json({ success: true, redirectTo: "/admin/sermon", message: "Created successfully" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, video_url } = req.body;
    const audioFile = req.files?.['audio']?.[0];
    const imageFile = req.files?.['image']?.[0];

    // Find the existing sermon
    const sermon = await service.findById(id);
    if (!sermon) {
      return res.status(404).json({ success: false, message: "Sermon not found" });
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
    const data = await service.update(id, updates);
    res.status(200).json({ success: true, data, redirectTo: `/admin/sermon/${req.params.id}`, message: "Updated successfully" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params; // Extract id from params

    const sermon = await service.findById(id);
    if (!sermon) {
      return res.status(404).json({
        success: false,
        message: "Sermon not found"
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

    const data = await service.destroy(id);
    res.status(200).json({ success: true, message: 'Deleted successfully', redirectTo: "/admin/sermon" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

export const renderCreate = async (req, res) => {
  try {
    res.status(200).render('./admins/sermon_create', {
      pageTitle: "Admin - Create Sermon",
      layout: "admin",
    });
  } catch (err) {
    console.log(err)
    res.status(500).render('errors/500', { error: err });
  }
};