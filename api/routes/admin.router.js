import express from "express";
import { signIn, signUp, signOut, allAdmin } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.get("/signOut", signOut);
router.get("/allAdmin", allAdmin);

export default router;
