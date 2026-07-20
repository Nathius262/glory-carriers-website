import db from '../../../models/index.cjs';

const { Project, ProjectImage } = db;

export const findAll = async ({ limit, offset }) => {
  try {
    const { rows: projects, count: totalItems } = await Project.findAndCountAll({
      limit,
      offset,
      distinct: true,
      order: [
        ['createdAt', 'DESC'],
        ['updatedAt', 'DESC'],
      ],
      include: [
        {
          model: ProjectImage,
          as: 'images',
          required: false,
          separate: true,
          order: [['sort_order', 'ASC']],
        },
      ],
    });

    return {
      projects,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    };
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching projects: ${error.message}`);
  }
};

export const findById = async (id) => {
  try {
    const project = await Project.findByPk(id, {
      include: [
        {
          model: ProjectImage,
          as: 'images',
          required: false,
          separate: true,
          order: [['sort_order', 'ASC']],
        },
      ],
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching project: ${error.message}`);
  }
};