import mongoose, { Schema } from "mongoose";
import { OTPType } from "@/types";
import validator from "validator";

const OtpSchema: Schema<OTPType> = new Schema<OTPType>({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  otp: {
    type: String,
    required: [true, "OTP is required"],
  },
  expiry: {
    type: Date,
    required: [true, "Expiry is required"],
  },
  uniqueId: {
    type: String,
    required: [true, "Unique ID is required"],
  },
});

const Otp =
  (mongoose.models.Otp as mongoose.Model<OTPType>) ||
  mongoose.model<OTPType>("Otp", OtpSchema);

export default Otp;
