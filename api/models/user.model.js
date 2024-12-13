import mongoose from "mongoose";
const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    kmcNumber: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    membershipType: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
    },
    qrCode: {
      type: String,
    },
    mealDetails: {
      dayOne: { breakfast: Boolean, lunch: Boolean, dinner: Boolean },
      dayTwo: { breakfast: Boolean, lunch: Boolean, dinner: Boolean },
    },
    kitReceived: { received: Boolean },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
