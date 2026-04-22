import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/auth.middleware.js";

import {
  postbid,
  fetchallbids,
  acceptbid,

} from "../controllers/bid.controller.js";
import { apiLimiter } from "../middleware/rate.limiter.js";

const router = Router();

/**
 * @swagger
 * /bids/{gigId}:
 *   post:
 *     summary: Create a bid
 *     tags: [Bids]
 *     parameters:
 *       - in: path
 *         name: gigId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Bid created successfully
 */
router.route("/:gigId",).post(apiLimiter,checkAuth, authorizeRoles("client"), postbid);



/**
 * @swagger
 * /bids/{gigId}:
 *   get:
 *     summary: Get all bids for a gig (Owner only)
 *     tags: [Bids]
 *     parameters:
 *       - in: path
 *         name: gigId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bids fetched successfully
 */

router.route("/:gigId").get(apiLimiter,checkAuth, authorizeRoles("owner"), fetchallbids);

/**
 * @swagger
 * /bids/{bidId}/hire:
 *   patch:
 *     summary: Accept a bid (Owner only)
 *     tags: [Bids]
 *     parameters:
 *       - in: path
 *         name: bidId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bid accepted successfully
 */
router.route("/:bidId/hire").patch(apiLimiter,checkAuth, authorizeRoles("owner"), acceptbid);



export default router;
