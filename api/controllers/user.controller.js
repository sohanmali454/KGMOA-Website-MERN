import Doctor from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

// Registration
export const doctorRegistration = async (req, res, next) => {
  const { name, place, kmcNumber, mobile, membershipType } = req.body;
  if (
    !name ||
    !place ||
    !kmcNumber ||
    !mobile ||
    !membershipType ||
    name.trim() === "" ||
    place.trim() === "" ||
    kmcNumber.trim() === "" ||
    mobile.trim() === "" ||
    membershipType.trim() === ""
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newDoctor = new Doctor({
    name,
    place,
    kmcNumber,
    mobile,
    membershipType,
  });

  try {
    await newDoctor.save();
    res.status(201).json({ message: "Registration Successful" });
  } catch (error) {
    next(error);
  }
};

// Fetch All Doctors
export const allDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find(); 
    res.status(200).json(doctors); 
  } catch (error) {
    next(error);
  }
};
