import * as service from '../services/Article.service.js';

export const findAll = async (req, res) => {
    const { page, limit, offset } = req.pagination;

    try {

        const data = await service.findAll({
            limit,
            offset
        });

        res.status(200).render('./article_list', {
            success: true,
            PageTitle: "List - Articles",
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



export const findBySlug = async (req, res) => {

    try {

        const article = await service.findBySlug(req.params.slug);

        res.status(200).render('./article_single', {

            success: true,

            PageTitle: "Article - " + article.title,

            article

        });

    } catch (err) {

        console.log(err);

        res.status(404).render('errors/404', {

            error: err

        });

    }

};
