import { Router } from "express";
import { renderIndex, renderAbout, renderSitemap, renderDepartment, renderContact, renderEvent, renderGiving } from "../controllers/rootController.js";
import {renderSearch} from '../controllers/mediaController.js'
import {registerOnlineUser, onlineRegisterForm} from '../controllers/authController.js'

const router = Router();

// Home Route
router.get('/', renderIndex);
router.get('/about', renderAbout);
router.get('/contact', renderContact);
router.get('/department', renderDepartment);
router.get('/event', renderEvent);
router.get('/giving', renderGiving);
router.get('/search', renderSearch);
router.get('/sitemap.xml', renderSitemap);


router.route('/members')
    .get(onlineRegisterForm)
    .post(registerOnlineUser);


export default router;