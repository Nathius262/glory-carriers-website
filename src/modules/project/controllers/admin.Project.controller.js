import * as service from "../services/admin.Project.service.js";
import cloudinary from "../../../config/cloudinaryConfig.js";
import { getPublicIdFromUrl } from "../../../utils/utils.js";

export const findAll = async (req, res) => {
  const { page, limit, offset } = req.pagination;

  try {
    const data = await service.findAll({ limit, offset });

    res.status(200).render("./admins/project_list", {
      success: true,
      layout: "admin",
      PageTitle: "Admin - Projects",
      projects: data.projects,
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      currentPage: page,
    });

  } catch (err) {
    console.error(err);

    res.status(500).render("errors/500", {
      error: err,
    });
  }
};

export const findById = async (req, res) => {
  try {

    const project = await service.findById(req.params.id);

    res.status(200).render("./admins/project_update", {
      success: true,
      layout: "admin",
      PageTitle: "Admin - Update Project",
      project,
    });

  } catch (err) {

    console.error(err);

    res.status(404).render("errors/404", {
      error: err,
    });

  }
};

export const renderCreate = async (req, res) => {

  try {

    res.status(200).render("./admins/project_create", {
      layout: "admin",
      PageTitle: "Admin - Create Project",
    });

  } catch (err) {

    console.error(err);

    res.status(500).render("errors/500", {
      error: err,
    });

  }

};

export const create = async (req, res) => {

  try {

    const project = await service.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      redirectTo: `/admin/project/${project.id}`,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

export const update = async (req, res) => {

  try {

    await service.update(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      redirectTo: `/admin/project/${req.params.id}`,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

export const destroy = async (req, res) => {

  try {

    const project = await service.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    /**
     * Delete every image from Cloudinary
     */
    for (const image of project.images) {

      try {

        await cloudinary.uploader.destroy(
          getPublicIdFromUrl(image.image_url),
          {
            resource_type: "image",
          }
        );

      } catch (cloudinaryErr) {

        console.error(
          `Failed deleting image ${image.id}`,
          cloudinaryErr
        );

      }

    }

    await service.destroy(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
      redirectTo: "/admin/project",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};