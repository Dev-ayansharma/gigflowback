import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import {
  postbid,
  fetchallbids,
  acceptbid,
} from "../controllers/bid.controller.js";
const router = Router();

router.route("/:gigId").post(checkAuth, postbid);
router.route("/:gigId").get(checkAuth, fetchallbids);
router.route("/:bidId/hire").patch(checkAuth, acceptbid);
export default router;
