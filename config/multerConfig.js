import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinaryConfig.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sermons',
    allowed_formats: ['jpg', 'jpeg', 'png', 'mp3', 'wav'],
  },
});

const upload = multer({ storage });

export default upload;
