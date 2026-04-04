import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";


dotenv.config();

const app = express();


app.use(
  cors({
    origin: process.env.ORIGIN || "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));


app.use(cookieParser());



import userRoutes from "./routers/user.routes.js";
import gigRoutes from "./routers/gig.routes.js";
import bidRoutes from "./routers/bid.routes.js";

app.use("/app/auth", userRoutes);
app.use("/app/gigs", gigRoutes);
app.use("/app/bids", bidRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});


export { app };
