import Admin from "../models/admin.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
  const { userName, email, password } = req.body;

  if (
    !userName ||
    !email ||
    !password ||
    userName === "" ||
    email === "" ||
    password === ""
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //encrypt password in hashcode
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newAdmin = new Admin({
    userName,
    email,
    password: hashedPassword,
  });

  try {
    await newAdmin.save();
    res.json("SignUp Successful");
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    console.log("Received signIn request with:", email);

    const validAdmin = await Admin.findOne({ email });
    console.log("Found user:", validAdmin);

    if (!validAdmin) {
      console.log("User not found!");
      return next(errorHandler(404, "User not found!"));
    }

    // Asynchronous password comparison
    const validPassword = await bcryptjs.compare(password, validAdmin.password);
    console.log("Password is valid:", validPassword);

    if (!validPassword) {
      console.log("Wrong credentials!");
      return next(errorHandler(401, "Wrong credentials!"));
    }

    // Generate JWT token
    const token = jwt.sign({ id: validAdmin._id }, process.env.JWT_SECRET);
    console.log("Generated token:", token);

    const { password: pass, ...rest } = validAdmin._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged Out!");
  } catch (error) {
    next(error);
  }
};

export const allAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.find();
    res.status(200).json(admin);
  } catch (error) {
    next(error);
  }
};

export const updateAdmin = async (req, res, next) => {
  if (req.admin.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!!"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteAdmin = async (req, res, next) => {
  if (req.admin.id !== req.params.id) {
    return next(errorHandler(401, "You can only delete your own account!"));
  }

  try {
    const validAdmin = await Admin.findById(req.params.id);
    if (!validAdmin) {
      return next(errorHandler(404, "Admin not found!"));
    }

    await Admin.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};
