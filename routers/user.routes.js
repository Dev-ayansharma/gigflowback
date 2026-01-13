import { Router } from "express";
import {
  createUser,
  loginUser,
  logoutuser,
  getUser,
} from "../controllers/user.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").post(checkAuth, logoutuser);
router.route("/me").get(checkAuth, getUser);

export default router;
