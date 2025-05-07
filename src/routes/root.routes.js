import { Router } from "express";
import { 
    index_view
} from "../controllers/root.controller.js";

const router = Router();

// Home Route
router.get('/', index_view);


export default router;