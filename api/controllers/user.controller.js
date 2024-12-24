import Doctor from "../models/user.model.js";

// Registration
export const doctorRegistration = async (req, res, next) => {
  const { name, place, kmcNumber, mobile, membershipType, paymentId, qrCode } =
    req.body;

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
    return next({ statusCode: 400, message: "All fields are required" });
  }

  const newDoctor = new Doctor({
    name,
    place,
    kmcNumber,
    mobile,
    membershipType,
    paymentId,
    qrCode,
  });

  try {
    await newDoctor.save();
    res.status(201).json({ success: true, message: "Registration Successful" });
  } catch (error) {
    if (error.code === 11000) {
      return next({
        statusCode: 400,
        message: `Duplicate entry for ${Object.keys(error.keyValue).join(
          ", "
        )}`,
      });
    }
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

// Handler to check if KMC number exists
export const checkKMCExist = async (req, res, next) => {
  try {
    const { kmcNumber } = req.body;

    // Validate if KMC number is provided
    if (!kmcNumber) {
      return res.status(400).json({ message: "KMC Number is required" });
    }

    // Query to check if KMC number exists in the database
    const kmcExist = await Doctor.findOne({ kmcNumber });

    if (kmcExist) {
      return res.status(400).json({ message: "KMC Number already exists" });
    }

    return res.status(200).json({ message: "KMC Number is available" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

// Delete Doctor by _id
export const deleteDoctor = async (req, res, next) => {
  const { _id } = req.params;

  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(_id);

    if (!deletedDoctor) {
      const error = new Error("Doctor not found");
      error.statusCode = 404;
      return next(error);
    }

    res
      .status(200)
      .json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    next(error);
  }
};
