import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/auth.middleware.js";

import {
  postbid,
  fetchallbids,
  acceptbid,
  updateBid,
} from "../controllers/bid.controller.js";
import { apiLimiter } from "../middleware/rate.limiter.js";

const router = Router();


router.post("/:gigId",apiLimiter, checkAuth, authorizeRoles("client"), postbid);


router.get("/:gigId", checkAuth, authorizeRoles("owner"), fetchallbids);


router.patch("/:bidId/hire", apiLimiter,checkAuth, authorizeRoles("owner"), acceptbid);
router.patch(
  "/:bidId",
  checkAuth,
  authorizeRoles("client"),
  updateBid
);

export default router;
