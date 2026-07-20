import db from '../../../models/index.cjs';

export const findAll = async ({ limit, offset }) => {

    try {

        const { rows: sermons, count: totalItems } =
            await db.Sermon.findAndCountAll({

                limit,
                offset,

                distinct: true,

                order: [
                    ['createdAt', 'DESC'],
                    ['updatedAt', 'DESC']
                ]

            });

        return {

            sermons,

            totalItems,

            totalPages: Math.ceil(totalItems / limit)

        };

    }

    catch (error) {

        console.log(error);

        throw new Error(`Error fetching sermons: ${error.message}`);

    }

};


export const findById = async (id) => {

    try {

        const sermon = await db.Sermon.findByPk(id);

        if (!sermon) {

            throw new Error("Sermon not found");

        }

        return sermon;

    }

    catch (error) {

        console.log(error);

        throw new Error(`Error fetching sermon: ${error.message}`);

    }

};


export const create = async (data) => {

    try {

        return await db.Sermon.create(data);

    }

    catch (error) {

        console.log(error);

        throw new Error(`Error creating sermon: ${error.message}`);

    }

};


export const update = async (id, data) => {

    try {

        const sermon = await db.Sermon.findByPk(id);

        if (!sermon) {

            throw new Error("Sermon not found");

        }

        return await sermon.update(data);

    }

    catch (error) {

        console.log(error);

        throw new Error(`Error updating sermon: ${error.message}`);

    }

};


export const destroy = async (id) => {

    try {

        const sermon = await db.Sermon.findByPk(id);

        if (!sermon) {

            throw new Error("Sermon not found");

        }

        await sermon.destroy();

        return true;

    }

    catch (error) {

        console.log(error);

        throw new Error(`Error deleting sermon: ${error.message}`);

    }

};