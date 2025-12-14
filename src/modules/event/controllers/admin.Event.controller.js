import * as service from '../services/admin.Event.service.js';
import {getPublicIdFromUrl} from '../../../utils/utils.js'
import cloudinary from '../../../config/cloudinaryConfig.js';

export const findAll = async (req, res) => {

  const {page, limit, offset} = req.pagination;
  try {
    const data = await service.findAll({limit, offset});
    res.status(200).render('./admins/event_list', {
      success: true,
      pageTitle: "Admin",
      events: data.events,
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      currentPage:page
    });
  } catch (err) {
    res.status(500).render('errors/500', { error: err.message });
  }
};

export const findById = async (req, res) => {
  try {
    const data = await service.findById(req.params.id);
    res.status(200).render('./admins/event_update', {
      success: true,
      pageTitle: "Update Record",
      event: data,
    });
  } catch (err) {
    res.status(404).render('errors/404', { error: err.message });
  }
};

export const create = async (req, res) => {
  try {
    if (!req.files ||  !req.files['image']) {
      return res.status(400).json({
        success: false,
        message: 'Missing required files (image)',
      });
    }

    const imageFile = req.files['image'][0];

    const allowedImageTypes = ['image/jpeg', 'image/png'];

    if (!allowedImageTypes.includes(imageFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image file type (only JPEG/PNG allowed)',
      });
    }

    let req_data = req.body;
    req_data.image_url = imageFile.path;

    const data = await service.create(req_data);

    res.status(201).json({ 
      success: true, 
      data 
    });

  } catch (err) {
    console.error('Create error:', err); // Log for debugging

    res.status(500).json({ 
      success: false, 
      message: 'Failed to create event',
      error: err.message 
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;

    const imageFile = req.files?.['image']?.[0];

    // Find the existing event
    const event = await service.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const { image_url: currentImageUrl } = event;
    let updates = req.body;

    try {

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

    // Update the event
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
  
      const event = await service.findById(id);
      if (!event) {
        return res.status(404).json({ 
          success: false, 
          message: "Event not found" 
        });
      }
  
      const { image_url: imageUrl } = event;
  
      
  
      try {

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
        redirectTo: "/admin/event"
      });
  
    } catch (err) {
      console.error("Delete error:", err); // Log for debugging
      res.status(500).json({ 
        success: false, 
        message: "Failed to delete event",
        error: err.message 
      });
    }
};

export const renderCreate = async (req, res) => {
  try {
    res.status(200).render('./admins/event_create', {
      pageTitle: "Create Event"
    });
  } catch (err) {
    res.status(500).render('errors/500', { error: err.message });
  }
};

export const findAllRvps =  async (req, res) => {
  const {page, limit, offset} = req.pagination;
  try {
    const rvps = await service.findAllRvps({limit, offset});
    res.status(200).render('./admins/event_rsvp_list', {
      success: true,
      pageTitle: "Admin - Event RSVPs",
      rvps: rvps.rvps,
      totalItems: rvps.totalItems,
      totalPages: rvps.totalPages,
      currentPage: page
    });
  } catch (error) {
    
  }
}