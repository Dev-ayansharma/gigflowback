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


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [owner, client]
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.route("/register").post(authLimiter,createUser);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.route("/login").post(authLimiter,loginUser);


/**
 * @swagger
 * /gigs:
 *   post:
 *     summary: Create a gig (Owner only)
 *     tags: [Gigs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, budget]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               budget:
 *                 type: number
 *     responses:
 *       201:
 *         description: Gig created successfully
 */


router.route("/logout").post(apiLimiter,checkAuth, logoutuser);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */

router.route("/me").get(apiLimiter,checkAuth, getUser);

export default router;
