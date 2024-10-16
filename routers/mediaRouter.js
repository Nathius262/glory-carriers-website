import { Router } from "express";
import { getAllSermons, getSingleSermon, getAllNowword, getAllZoeRecord, renderStream } from "../controllers/mediaController.js"

const router = Router();

///////////////////////////
///////////////////////////
////// SERMON ROUTE ///////
///////////////////////////
///////////////////////////


router.get('/sermon', getAllSermons);
router.get('/sermon/:id', getSingleSermon);


////////////////////////////
////////////////////////////
////  NOWWORD ROUTE ////////
////////////////////////////
////////////////////////////


router.get('/now-word', getAllNowword)


////////////////////////////
////////////////////////////
////  ZOE RECORD ROUTE /////
////////////////////////////
////////////////////////////

router.get('/zoe-record', getAllZoeRecord)
   
////////////////////////////
////////////////////////////
/////// STREAM ROUTE ///////
////////////////////////////
////////////////////////////

router.get('/stream', renderStream);

export default router;