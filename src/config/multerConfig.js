import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinaryConfig.js';


// Function to check if a file exists in Cloudinary
const fileExists = async (folder, filename) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: `${folder}/${filename}`
    });
    return result.resources.length > 0;
  } catch (err) {
    console.error('Error checking file existence in Cloudinary:', err);
    return false;
  }
};

// Configure Multer to use Cloudinary storage with dynamic folder creation and unique filename
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' }); // Full month name, e.g., "June"

    // Get the section (or folder) from the request
    const section = req.section || 'products'; // Default to 'products' if section is not set

    let folderName = `${section}/${year}/${month}`; // Dynamic folder path
    let resourceType = 'auto'; // Default resource type, can be auto, image, raw, or video based on file type
    let publicId = file.originalname.split('.')[0]; // Use the original name without extension

    // Check if the file already exists in the folder
    const exists = await fileExists(folderName, publicId);

    if (exists) {
      // If the file exists, append a timestamp to make it unique
      publicId = `${publicId}-${Date.now()}`;
    }

    if (file.mimetype.startsWith('audio')) {
      resourceType = 'video'; // Cloudinary treats audio files as video
    } else if (file.mimetype.startsWith('image')) {
      resourceType = 'image';
    } else if (['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.mimetype)) {
      resourceType = 'raw';
    }

    return {
      folder: folderName,
      resource_type: resourceType,
      public_id: publicId, // Use the determined unique publicId
    };
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 80 * 1024 * 1024 } // Limit to 80MB
});
export default upload;
