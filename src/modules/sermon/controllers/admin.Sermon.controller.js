import * as service from '../services/admin.Sermon.service.js';
import capitalizeWords from '../../../utils/utils.js';
import {getPublicIdFromUrl} from '../../../utils/utils.js'


export const findAll = async (req, res) => {
  try {
    const data = await service.findAll();
    res.status(200).render('./admins/list', {
      success: true,
      pageTitle: "Admin",
      sermons: data,
    });
  } catch (err) {
    res.status(500).render('error', { error: err.message });
  }
};

export const findById = async (req, res) => {
  try {
    const data = await service.findById(req.params.id);
    res.status(200).render('./admins/update', {
      success: true,
      pageTitle: "Update Record",
      sermon: [data],
    });
  } catch (err) {
    res.status(404).render('error', { error: err.message });
  }
};

export const create = async (req, res) => {
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
    
    const req_data = {
      title, 
      audio_url: audioResult.path, 
      image_url: imageResult.path, 
      video_url: req.body.video_url
    }
    
    const data = await service.create(req_data);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const update = async (req, res) => {
  try {

    const { id } = req.params;
    const { title, video_url } = req.body;
    const audio_url = req.files?.['audio'] ? req.files['audio'][0].path : null;
    const image_url = req.files?.['image'] ? req.files['image'][0].path : null;

    const sermon = await service.findById(id)
    if (!sermon){
      return res.status(404).json({success:false, message:"Not found"})
    }

    const { audio_url: currentAudioUrl, image_url: currentImageUrl } = sermon;

    if (audio_url && currentAudioUrl) {
      await cloudinary.uploader.destroy(getPublicIdFromUrl(currentAudioUrl), { resource_type: 'video' });
    }

    // Check if new image is uploaded and delete the old one from Cloudinary
    if (image_url && currentImageUrl) {
      await cloudinary.uploader.destroy(getPublicIdFromUrl(currentImageUrl, { resource_type: 'image' }));
    }

    const requested_data = {
      title, 
      audio_url,
      image_url,
      video_url,
    }
    
    const data = await service.update(req.params.id, requested_data);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const destroy = async (req, res) => {
  try {

    
    const sermon = await service.findById(id)
    if (!sermon){
      return res.status(404).json({success:false, message:"Not found"})
    }

    const { audio_url: audioUrl, image_url: imageUrl } = sermon;


    // Delete the audio and image files from Cloudinary
    if (audioUrl) {
      const audioPublicId = getPublicIdFromUrl(audioUrl);
      const audio = await cloudinary.uploader.destroy(audioPublicId, { resource_type: 'video' }); // Specify the resource type as 'video' for audio files
    }

    if (imageUrl) {
      const imagePublicId = getPublicIdFromUrl(imageUrl);
      const image = await cloudinary.uploader.destroy(imagePublicId, { resource_type: 'image' }); // Specify the resource type as 'image' for images
    }


    const data = await service.destroy(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const renderCreate = async (req, res) => {
  try {
    res.status(200).render('./admins/create', {
      pageTitle: "Create Sermon"
    });
  } catch (err) {
    res.status(500).render('error', { error: err.message });
  }
};