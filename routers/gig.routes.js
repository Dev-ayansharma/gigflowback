import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import { GigUpload, Allgigs } from "../controllers/gig.controller.js";
const router = Router();

router.route("/").post(checkAuth, GigUpload);
router.route("/allgigs").get(checkAuth, Allgigs);
export default router;
