import { Op } from 'sequelize';
import db from '../../../models/index.cjs';

/**
 * Fetch all articles with pagination and search
 */
export const findAll = async ({ limit = 10, offset = 0, search = "" } = {}) => {
  try {
    const where = {};
    const searchOperator = db.sequelize.getDialect() === "postgres" ? Op.iLike : Op.like;
            
    if (search) {
      where[Op.or] = [
        { title: { [searchOperator]: `%${search}%` } },
        { summary: { [searchOperator]: `%${search}%` } },
        { author: { [searchOperator]: `%${search}%` } }
      ];
    }

    const { rows: articles, count: totalItems } = await db.Article.findAndCountAll({
      where,
      limit,
      offset,
      order: [
        ['published_at', 'DESC'],
        ['created_at', 'DESC'],
        ['id', 'DESC'] // Guarantees strict, deterministic pagination ordering
      ]
    });

    return {
      articles,
      totalItems,
      totalPages: limit > 0 ? Math.ceil(totalItems / limit) : 1
    };

  } catch (error) {
    console.error("Database error in findAll:", error);
    throw new Error("Error fetching records: " + error.message);
  }
};


/**
 * Find by ID
 */
export const findById = async (id) => {

  try {

    const article = await db.Article.findByPk(id);

    if (!article) {

      throw new Error("Article not found");

    }

    return article;

  }

  catch (error) {

    console.error(error);

    throw new Error("Error fetching record: " + error.message);

  }

};



/**
 * Find by slug
 */
export const findBySlug = async (slug) => {

  try {

    const article = await db.Article.findOne({

      where: {

        slug

      }

    });

    if (!article) {

      throw new Error("Article not found");

    }

    return article;

  }

  catch (error) {

    console.error(error);

    throw new Error("Error fetching record: " + error.message);

  }

};



/**
 * Create
 */
export const create = async (data) => {

  try {

    return await db.Article.create(data);

  }

  catch (error) {

    console.error(error);

    throw new Error("Error creating record: " + error.message);

  }

};



/**
 * Update
 */
export const update = async (id, data) => {

  try {

    const article = await db.Article.findByPk(id);

    if (!article) {

      throw new Error("Article not found");

    }

    return await article.update(data);

  }

  catch (error) {

    console.error(error);

    throw new Error("Error updating record: " + error.message);

  }

};



/**
 * Delete
 */
export const destroy = async (id) => {

  try {

    const article = await db.Article.findByPk(id);

    if (!article) {

      throw new Error("Article not found");

    }

    await article.destroy();

    return true;

  }

  catch (error) {

    console.error(error);

    throw new Error("Error deleting record: " + error.message);

  }

};