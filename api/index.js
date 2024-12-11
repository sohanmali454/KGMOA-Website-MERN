import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// app.use(express.json());
// app.use(cookieParser());
// app.use(cors());
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!!!`);
});

// app.use("/api/user", userRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/listing", listingRoutes);

// Error handling middleware
// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal Server Error";

//   return res.status(statusCode).json({
//     success: false,
//     statusCode,
//     message,
//   });
// });
