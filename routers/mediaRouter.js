import { Router } from "express";
import {renderMedia, renderNowWord, renderStream, renderZoeRecord} from "../controllers/mediaController.js"


const router = Router();

//Media Routes
router.get('', renderMedia);
router.get('/now-word', renderNowWord);
router.get('/stream', renderStream);
router.get('/zoe-records', renderZoeRecord);

export default router;