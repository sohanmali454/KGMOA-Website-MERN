import express from "express";

import {
  doctorRegistration,
  allDoctors,
  checkKMCExist,
  deleteDoctor,
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/doctorRegistration", doctorRegistration);
router.post("/checkKMCExist", checkKMCExist);
router.get("/allDoctors", allDoctors);
router.delete("/deleteDoctor/:_id", deleteDoctor);
export default router;
