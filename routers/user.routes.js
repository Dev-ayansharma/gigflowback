import { Router } from "express";
import {
  createUser,
  loginUser,
  logoutuser,
  getUser,
} from "../controllers/user.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";
import { authLimiter,apiLimiter } from "../middleware/rate.limiter.js";
const router = Router();

router.route("/register").post(authLimiter,createUser);
router.route("/login").post(authLimiter,loginUser);
router.route("/logout").post(apiLimiter,checkAuth, logoutuser);
router.route("/me").get(apiLimiter,checkAuth, getUser);

export default router;
