import * as service from '../services/admin.Article.service.js';
import cloudinary from '../../../config/cloudinaryConfig.js';
import { getPublicIdFromUrl } from '../../../utils/utils.js';

export const findAll = async (req, res) => {
    const { page, limit, offset } = req.pagination;

    try {

        const data = await service.findAll({
            limit,
            offset
        });

        res.status(200).render('./admins/article_list', {
            success: true,
            layout: "admin",
            PageTitle: "Admin - Articles",
            articles: data.articles,
            totalItems: data.totalItems,
            totalPages: data.totalPages,
            currentPage: page
        });

    } catch (err) {

        console.log(err);

        res.status(500).render('errors/500', {
            error: err
        });

    }

};



export const findById = async (req, res) => {

    try {

        const article = await service.findById(req.params.id);

        res.status(200).render('./admins/article_update', {

            success: true,

            layout: "admin",

            PageTitle: "Admin - Update Article",

            article

        });

    } catch (err) {

        console.log(err);

        res.status(404).render('errors/404', {

            error: err

        });

    }

};



export const renderCreate = async (req, res) => {

    try {

        res.status(200).render('./admins/article_create', {

            layout: "admin",

            PageTitle: "Admin - Create Article"

        });

    } catch (err) {

        console.log(err);

        res.status(500).render('errors/500', {

            error: err

        });

    }

};



export const create = async (req, res) => {

    try {

        if (!req.files || !req.files["image"]) {

            return res.status(400).json({

                success: false,

                message: "Featured image is required."

            });

        }

        const image = req.files["image"][0];

        const allowedTypes = [

            "image/jpeg",

            "image/png",

            "image/webp"

        ];

        if (!allowedTypes.includes(image.mimetype)) {

            return res.status(400).json({

                success: false,

                message: "Only JPG, PNG and WEBP images are allowed."

            });

        }

        const article = {

            ...req.body,

            image_url: image.path

        };

        await service.create(article);

        res.status(201).json({

            success: true,

            message: "Article created successfully.",

            redirectTo: "/admin/article"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};



export const update = async (req, res) => {

    try {

        const article = await service.findById(req.params.id);

        if (!article) {

            return res.status(404).json({

                success: false,

                message: "Article not found."

            });

        }

        const updates = {

            ...req.body

        };

        const image = req.files?.image?.[0];

        if (image) {

            updates.image_url = image.path;

            if (article.image_url) {

                await cloudinary.uploader.destroy(

                    getPublicIdFromUrl(article.image_url),

                    {

                        resource_type: "image"

                    }

                );

            }

        }

        await service.update(

            req.params.id,

            updates

        );

        res.status(200).json({

            success: true,

            message: "Article updated successfully.",

            redirectTo: `/admin/article/${req.params.id}`

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};



export const destroy = async (req, res) => {

    try {

        const article = await service.findById(req.params.id);

        if (!article) {

            return res.status(404).json({

                success: false,

                message: "Article not found."

            });

        }

        if (article.image_url) {

            await cloudinary.uploader.destroy(

                getPublicIdFromUrl(article.image_url),

                {

                    resource_type: "image"

                }

            );

        }

        await service.destroy(req.params.id);

        res.status(200).json({

            success: true,

            message: "Article deleted successfully.",

            redirectTo: "/admin/article"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};