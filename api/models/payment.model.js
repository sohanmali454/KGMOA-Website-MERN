import mongoose, { model } from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true, unique: true },
    razorpay_signature: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


const payment = mongoose.model("payment", paymentSchema);
export default payment;
