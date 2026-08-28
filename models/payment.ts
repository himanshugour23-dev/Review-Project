import mongoose, { Schema, Model, models } from "mongoose";

export interface IPayment {
  userId: mongoose.Types.ObjectId;
  razorpayOrderId: string;      
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: "created" | "captured" | "failed";  
  createdAt?: Date;
  updatedAt?: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, index: true },
    razorpaySignature: String,
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["created", "captured", "failed"],
      default: "created",
    }
  },
  { timestamps: true }
);

const Payment: Model<IPayment> =
  models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;