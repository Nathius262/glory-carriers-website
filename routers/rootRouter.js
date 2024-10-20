import { Router } from "express";
import { 
    renderIndex, renderAbout, renderSitemap, renderDepartment, 
    renderContact, renderEvent, registerEvent, renderGiving,
    registerHealingSchool, renderHealingSchool
} from "../controllers/rootController.js";
import {renderSearch} from '../controllers/mediaController.js'
import {registerOnlineUser, onlineRegisterForm} from '../controllers/authController.js'

const router = Router();

// Home Route
router.get('/', renderIndex);
router.get('/about', renderAbout);
router.get('/contact', renderContact);
router.get('/department', renderDepartment);

router.route('/event')
    .get(renderEvent)
    .post(registerEvent);

router.get('/giving', renderGiving);
router.get('/search', renderSearch);
router.get('/sitemap.xml', renderSitemap);


router.route('/members')
    .get(onlineRegisterForm)
    .post(registerOnlineUser);


router.route('/healing-school')
    .get(renderHealingSchool)
    .post(registerHealingSchool);


export default router;