import mongoose, { Schema, Model, models } from "mongoose";

export interface IReport {
  reporterId: mongoose.Types.ObjectId; 
  reviewId: mongoose.Types.ObjectId;   
  reason: string;

  status: "pending" | "approved" | "rejected";
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reviewId: {
      type: Schema.Types.ObjectId,
      ref: "Review",
      required: true,
      index: true,
    },

    reason: {
      type: String,
      maxlength: 300,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: Date,
  },
  { timestamps: true }
);

ReportSchema.index(
  { reporterId: 1, reviewId: 1 },
  { unique: true }
);

const Report: Model<IReport> =
  models.Report || mongoose.model<IReport>("Report", ReportSchema);

export default Report;
