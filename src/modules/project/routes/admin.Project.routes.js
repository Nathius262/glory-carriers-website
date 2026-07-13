import express from "express";

import useModuleViews from "../../../middlewares/moduleViews.js";
import { withPagination } from "../../../middlewares/paginations.js";
import upload from "../../../config/multerConfig.js";
import setSection from "../../../middlewares/uploadLocation.js";

import * as projectController from "../controllers/admin.Project.controller.js";
import * as projectImageController from "../controllers/admin.ProjectImage.controller.js";

const router = express.Router();

router.use(useModuleViews("project"));

/*
|--------------------------------------------------------------------------
| Project Routes
|--------------------------------------------------------------------------
*/

router.route("/")
  .get(withPagination(20), projectController.findAll)
  .post(projectController.create);

router.route("/create")
  .get(projectController.renderCreate)
  .post(projectController.create);

router.route("/:id")
  .get(projectController.findById)
  .put(projectController.update)
  .delete(projectController.destroy);

/*
|--------------------------------------------------------------------------
| Gallery Routes
|--------------------------------------------------------------------------
*/

/**
 * Upload one or multiple images
 */
router.post(
  "/:projectId/images",
  setSection("projects"),
  upload.array("images", 20),
  projectImageController.create
);

/**
 * Replace one image
 */
router.put(
  "/image/:imageId",
  setSection("projects"),
  upload.single("image"),
  projectImageController.update
);

/**
 * Delete one image
 */
router.delete(
  "/image/:imageId",
  projectImageController.destroy
);

/**
 * Reorder gallery
 */
router.put(
  "/images/reorder",
  projectImageController.updateSortOrder
);

export default router;