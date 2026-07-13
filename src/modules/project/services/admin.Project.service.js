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

export const create = async (data) => {
  try {
    return await Project.create(data);
  } catch (error) {
    console.error(error);
    throw new Error(`Error creating project: ${error.message}`);
  }
};

export const update = async (id, data) => {
  try {
    const project = await Project.findByPk(id);

    if (!project) {
      throw new Error('Project not found');
    }

    return await project.update(data);
  } catch (error) {
    console.error(error);
    throw new Error(`Error updating project: ${error.message}`);
  }
};

export const destroy = async (id) => {
  try {
    const project = await Project.findByPk(id, {
      include: [
        {
          model: ProjectImage,
          as: 'images',
        },
      ],
    });

    if (!project) {
      throw new Error('Project not found');
    }

    await project.destroy();

    return project;
  } catch (error) {
    console.error(error);
    throw new Error(`Error deleting project: ${error.message}`);
  }
};

export const findFeatured = async () => {
  try {
    return await Project.findAll({
      where: {
        is_featured: true,
        is_active: true,
      },
      include: [
        {
          model: ProjectImage,
          as: 'images',
          required: false,
          separate: true,
          order: [['sort_order', 'ASC']],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching featured projects: ${error.message}`);
  }
};

export const findActive = async () => {
  try {
    return await Project.findAll({
      where: {
        is_active: true,
      },
      include: [
        {
          model: ProjectImage,
          as: 'images',
          required: false,
          separate: true,
          order: [['sort_order', 'ASC']],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching active projects: ${error.message}`);
  }
};