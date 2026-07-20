import * as service from '../services/admin.Sermon.service.js';
import { getPublicIdFromUrl } from '../../../utils/utils.js'
import cloudinary from '../../../config/cloudinaryConfig.js';
import { success } from 'zod';

export const findAll = async (req, res) => {

    try {

        const { page, limit, offset } = req.pagination;

        const data = await service.findAll({ limit, offset });

        res.render("./admins/sermon_list", {

            layout: "admin",

            pageTitle: "Sermon Management",

            sermons: data.sermons,

            totalItems: data.totalItems,

            totalPages: data.totalPages,

            currentPage: page

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).render("errors/500", {

            error: err

        });

    }

};

export const findById = async (req, res) => {

    try {

        const sermon = await service.findById(req.params.id);

        res.render("./admins/sermon_update", {

            layout: "admin",

            pageTitle: "Update Sermon",

            sermon

        });

    }

    catch (err) {

        console.log(err);

        res.status(404).render("errors/404", {

            error: err

        });

    }

};

export const create = async (req, res) => {
    try {

        if (!req.files?.audio?.[0] || !req.files?.image?.[0]) {
            return res.status(400).json({
                success: false,
                message: "Audio and featured image are required."
            });
        }

        const audio = req.files.audio[0];
        const image = req.files.image[0];

        const allowedAudio = [
            "audio/mpeg",
            "audio/mp3",
            "audio/wav"
        ];

        const allowedImages = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedAudio.includes(audio.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Only MP3 and WAV files are allowed."
            });
        }

        if (!allowedImages.includes(image.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Only JPG, PNG and WEBP images are allowed."
            });
        }

        const sermon = await service.create({

            title: req.body.title,

            slug: req.body.slug,

            video_url: req.body.video_url || null,

            audio_url: audio.path,

            image_url: image.path

        });

        return res.status(201).json({

            success: true,

            message: "Sermon created successfully.",

            redirectTo: "/admin/sermon"

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }
};

export const update = async (req, res) => {

    try {

        const { id } = req.params;

        const sermon = await service.findById(id);

        if (!sermon) {

            return res.status(404).json({
                success: false,
                message: "Sermon not found."
            });

        }

        const updates = {

            title: req.body.title,

            slug: req.body.slug,

            video_url: req.body.video_url || null

        };

        /*
        --------------------------------
        Audio
        --------------------------------
        */

        if (req.files?.audio?.length) {

            const audio = req.files.audio[0];

            updates.audio_url = audio.path;

            if (sermon.audio_url) {

                await cloudinary.uploader.destroy(

                    getPublicIdFromUrl(sermon.audio_url),

                    { resource_type: "video" }

                );

            }

        }

        /*
        --------------------------------
        Image
        --------------------------------
        */

        if (req.files?.image?.length) {

            const image = req.files.image[0];

            updates.image_url = image.path;

            if (sermon.image_url) {

                await cloudinary.uploader.destroy(

                    getPublicIdFromUrl(sermon.image_url),

                    { resource_type: "image" }

                );

            }

        }

        await service.update(id, updates);

        return res.status(200).json({

            success: true,

            message: "Sermon updated successfully.",

            redirectTo: `/admin/sermon/${id}`

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

export const destroy = async (req, res) => {

    try {

        const sermon = await service.findById(req.params.id);

        if (!sermon) {

            return res.status(404).json({

                success: false,

                message: "Sermon not found."

            });

        }

        /*
        --------------------------------
        Delete Cloudinary files
        --------------------------------
        */

        if (sermon.audio_url) {

            await cloudinary.uploader.destroy(

                getPublicIdFromUrl(sermon.audio_url),

                { resource_type: "video" }

            );

        }

        if (sermon.image_url) {

            await cloudinary.uploader.destroy(

                getPublicIdFromUrl(sermon.image_url),

                { resource_type: "image" }

            );

        }

        await service.destroy(req.params.id);

        return res.status(200).json({

            success: true,

            message: "Sermon deleted successfully.",

            redirectTo: "/admin/sermon"

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

export const renderCreate = (req, res) => {

    res.render("./admins/sermon_create", {

        layout: "admin",

        pageTitle: "Create Sermon"

    });

};