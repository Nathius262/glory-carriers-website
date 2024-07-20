import { Router } from "express";
import { renderIndex, renderAbout, renderDepartment, renderContact, renderEvent, renderGiving } from "../controllers/rootController.js";

const router = Router();

// Home Route
router.get('/', renderIndex);
router.get('/about', renderAbout);
router.get('/contact', renderContact);
router.get('/department', renderDepartment);
router.get('/event', renderEvent);
router.get('/giving', renderGiving);


export default router;