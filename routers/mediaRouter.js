import { Router } from "express";
import {renderNowWord, renderStream, renderZoeRecord} from "../controllers/mediaController.js"
import {createSermon, updateSermon, deleteSermon, getAllSermons, getSermonById} from "../controllers/sermonController.js"
import upload from '../config/multerConfig.js';

const router = Router();

// Route to render the form for adding a new sermon
router.get('/sermon/create', (req, res) => {
    res.render('./sermons/createSermon');
});

// Route to render the form for adding a new sermon
router.post('/sermon/create', (req, res) => {
    console.log(req.body)
    console.log(req.files)
});

//Media Routes
router.route('/')
    .get(getAllSermons);


router.post('/sermon/post', createSermon);

router.route('/:id')
    .get(getSermonById)
    .put(upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'image', maxCount: 1 }]), updateSermon)
    .delete(deleteSermon);


router.get('/now-word', renderNowWord);
router.get('/stream', renderStream);
router.get('/zoe-records', renderZoeRecord);

export default router;