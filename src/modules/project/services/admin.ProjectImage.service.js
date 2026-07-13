import db from '../../../models/index.cjs';

const { Project, ProjectImage } = db;

/**
 * Get all images belonging to a project
 */
export const findByProject = async (projectId) => {
    try {

        return await ProjectImage.findAll({
            where: {
                project_id: projectId,
            },
            order: [
                ['sort_order', 'ASC'],
                ['createdAt', 'ASC'],
            ],
        });

    } catch (error) {

        console.error(error);

        throw new Error(`Error fetching project images: ${error.message}`);

    }
};

/**
 * Find a single image
 */
export const findById = async (id) => {

    try {

        const image = await ProjectImage.findByPk(id);

        if (!image) {
            throw new Error('Project image not found');
        }

        return image;

    } catch (error) {

        console.error(error);

        throw new Error(`Error fetching image: ${error.message}`);

    }

};

/**
 * Create a single image
 */
export const create = async (data) => {

    try {

        return await ProjectImage.create(data);

    } catch (error) {

        console.error(error);

        throw new Error(`Error creating image: ${error.message}`);

    }

};

/**
 * Bulk upload images
 */
export const bulkCreate = async (projectId, images) => {

    try {

        const payload = images.map((image, index) => ({
            project_id: projectId,
            image_url: image.path,
            sort_order: index,
        }));

        return await ProjectImage.bulkCreate(payload);

    } catch (error) {

        console.error(error);

        throw new Error(`Error creating project gallery: ${error.message}`);

    }

};

/**
 * Replace image
 */
export const update = async (id, data) => {

    try {

        const image = await ProjectImage.findByPk(id);

        if (!image) {
            throw new Error('Project image not found');
        }

        return await image.update(data);

    } catch (error) {

        console.error(error);

        throw new Error(`Error updating image: ${error.message}`);

    }

};

/**
 * Update image ordering
 */
export const updateSortOrder = async (items) => {

    try {

        const updates = items.map(({ id, sort_order }) =>
            ProjectImage.update(
                { sort_order },
                {
                    where: { id },
                }
            )
        );

        await Promise.all(updates);

        return true;

    } catch (error) {

        console.error(error);

        throw new Error(`Error updating sort order: ${error.message}`);

    }

};

/**
 * Delete one image
 */
export const destroy = async (id) => {

    try {

        const image = await ProjectImage.findByPk(id);

        if (!image) {
            throw new Error('Project image not found');
        }

        await image.destroy();

        return image;

    } catch (error) {

        console.error(error);

        throw new Error(`Error deleting image: ${error.message}`);

    }

};