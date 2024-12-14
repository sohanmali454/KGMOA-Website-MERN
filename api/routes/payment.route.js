import express from "express";
import { order, verify } from "../controllers/payment.controllers.js";
const router = express.Router();

router.post("/order", order);
router.post("/verify", verify);

export default router;
