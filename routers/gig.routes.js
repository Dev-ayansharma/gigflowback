import { Router } from "express";
import { authorizeRoles, checkAuth } from "../middleware/auth.middleware.js";
import { GigUpload, Allgigs, deleteGig } from "../controllers/gig.controller.js";
import { apiLimiter } from "../middleware/rate.limiter.js";
const router = Router();

router.route("/").post(apiLimiter,checkAuth,authorizeRoles("owner"), GigUpload);
router.route("/allgigs").get(apiLimiter,checkAuth, Allgigs);
router.delete(
  "/:gigId",
  checkAuth,
  authorizeRoles("owner"),
  deleteGig
);
export default router;
