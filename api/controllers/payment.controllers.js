import Razorpay from "razorpay";
import { errorHandler } from "../utils/error.js";
import Payment from "../models/payment.model.js";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// Create Razorpay Instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Order Creation API
export const order = async (req, res, next) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: Number(amount * 100), // Amount in paise
      currency: "INR",
      receipt: `receipt_${crypto.randomBytes(10).toString("hex")}`, // Generate receipt ID
    };

    razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        console.error("Error creating Razorpay order:", err);
        return next(errorHandler(500, "Failed to create Razorpay order!"));
      }

      if (order && order.id) {
        // Send the order details to the frontend
        return res.status(200).json({ success: true, order });
      } else {
        return next(errorHandler(500, "Order creation failed!"));
      }
    });
  } catch (error) {
    console.error("Unexpected error in order creation:", error);
    return next(errorHandler(500, "Something went wrong!"));
  }
};


// Verify Payment API
export const verify = async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  try {
    // Generate the expected signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    // Validate signature
    const isAuthentic = expectedSign === razorpay_signature;

    if (isAuthentic) {
      // Save payment details in database
      const payment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      await payment.save();

      res.status(200).json({
        success: true,
        message: "Payment verified successfully!",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid payment signature!",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return next(errorHandler(500, "Internal server error!"));
  }
};
