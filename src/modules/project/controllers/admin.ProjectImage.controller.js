import * as service from "../services/admin.ProjectImage.service.js";
import cloudinary from "../../../config/cloudinaryConfig.js";
import { getPublicIdFromUrl } from "../../../utils/utils.js";

/**
 * Upload one or multiple images
 */
export const create = async (req, res) => {
    try {

        const { projectId } = req.params;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please select at least one image.",
            });
        }

        const allowedImageTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/jpg",
        ];

        for (const file of req.files) {

            if (!allowedImageTypes.includes(file.mimetype)) {

                return res.status(400).json({
                    success: false,
                    message: `${file.originalname} is not a valid image.`,
                });

            }

        }

        await service.bulkCreate(projectId, req.files);

        res.status(201).json({
            success: true,
            message: "Images uploaded successfully.",
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }
};

/**
 * Replace a single image
 */
export const update = async (req, res) => {

    try {

        const { imageId } = req.params;

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Please select an image.",
            });

        }

        const allowedImageTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/jpg",
        ];

        if (!allowedImageTypes.includes(req.file.mimetype)) {

            return res.status(400).json({
                success: false,
                message: "Invalid image format.",
            });

        }

        const image = await service.findById(imageId);

        if (!image) {

            return res.status(404).json({
                success: false,
                message: "Image not found.",
            });

        }

        /**
         * Delete old cloudinary image
         */
        if (image.image_url) {

            await cloudinary.uploader.destroy(
                getPublicIdFromUrl(image.image_url),
                {
                    resource_type: "image",
                }
            );

        }

        await service.update(imageId, {
            image_url: req.file.path,
        });

        res.status(200).json({
            success: true,
            message: "Image updated successfully.",
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};

/**
 * Delete image
 */
export const destroy = async (req, res) => {

    try {

        const { imageId } = req.params;

        const image = await service.findById(imageId);

        if (!image) {

            return res.status(404).json({
                success: false,
                message: "Image not found.",
            });

        }

        if (image.image_url) {

            await cloudinary.uploader.destroy(
                getPublicIdFromUrl(image.image_url),
                {
                    resource_type: "image",
                }
            );

        }

        await service.destroy(imageId);

        res.status(200).json({
            success: true,
            message: "Image deleted successfully.",
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};

/**
 * Reorder gallery
 */
export const updateSortOrder = async (req, res) => {

    try {

        await service.updateSortOrder(req.body);

        res.status(200).json({
            success: true,
            message: "Gallery reordered successfully.",
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};