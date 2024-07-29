import { Router } from "express";
import { renderStream } from "../controllers/mediaController.js"
import {createSermon, updateSermon, deleteSermon, getAllSermons, getSermonById} from "../controllers/sermonController.js"
import { newNowword, getAllNowword } from "../controllers/nowwordController.js";
import { newZoeRecord, getAllZoeRecord } from "../controllers/zoeRecordController.js";
import upload from '../config/multerConfig.js';
import setSection from "../middlewares/uploadLocation.js";

const router = Router();

///////////////////////////
///////////////////////////
////// SERMON ROUTE ///////
///////////////////////////
///////////////////////////

router.get('/create-sermon', (req, res) => {
    res.render('./sermons/createSermon');
});

router.route('/sermon')
    .get(getAllSermons)
    .post(upload.fields([
        {name: 'audio', maxCount:1},
        {name: 'image', maxCount:1}
    ]), createSermon);


router.route('/sermon/:id')
    .get(getSermonById)
    .put(upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'image', maxCount: 1 }]), updateSermon)
    .delete(deleteSermon);


////////////////////////////
////////////////////////////
////  NOWWORD ROUTE ////////
////////////////////////////
////////////////////////////

router.get('/create-now-word', (req, res) => {
    res.render('./nowword/create_now_word');
});

router.route('/now-word')
    .get(getAllNowword)
    .post(setSection('now_word'), upload.fields([{name: 'file', maxCount:1}]), newNowword);


////////////////////////////
////////////////////////////
////  ZOE RECORD ROUTE /////
////////////////////////////
////////////////////////////

router.get('/create-zoe-record', (req, res) => {
    res.render('./zoe_record/create_zoe_record');
});

router.route('/zoe-record')
    .get(getAllZoeRecord)
    .post(setSection('zoe_record'), upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'image', maxCount: 1 }]), newZoeRecord);

////////////////////////////
////////////////////////////
/////// STREAM ROUTE ///////
////////////////////////////
////////////////////////////

router.get('/stream', renderStream);

export default router;