import express from "express";

import {
  doctorRegistration,
  allDoctors,
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/doctorRegistration", doctorRegistration);
router.get("/allDoctors", allDoctors);
export default router;
