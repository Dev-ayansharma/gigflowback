import { Router } from "express";
import { authorizeRoles, checkAuth } from "../middleware/auth.middleware.js";
import { GigUpload, Allgigs, deleteGig } from "../controllers/gig.controller.js";
import { apiLimiter } from "../middleware/rate.limiter.js";
const router = Router();



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
router.route("/").post(apiLimiter,checkAuth,authorizeRoles("owner"), GigUpload);



/**
 * @swagger
 * /gigs/allgigs:
 *   get:
 *     summary: Get all gigs or search by title
 *     tags: [Gigs]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: false
 *         description: Search gigs by title
 *     responses:
 *       200:
 *         description: Gigs fetched successfully
 */
router.route("/allgigs").get(apiLimiter,checkAuth, Allgigs);


/**
 * @swagger
 * /gigs/{gigId}:
 *   delete:
 *     summary: Soft delete a gig (Owner only)
 *     tags: [Gigs]
 *     parameters:
 *       - in: path
 *         name: gigId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gig deleted successfully
 */
router.route("/:gigId",).delete(
  apiLimiter,
  checkAuth,
  authorizeRoles("owner"),
  deleteGig
);
export default router;
