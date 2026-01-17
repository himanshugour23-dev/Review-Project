import mongoose, { Schema, Model, models } from "mongoose";

export interface IReviewReaction {
  userId: mongoose.Types.ObjectId;
  reviewId: mongoose.Types.ObjectId;
  type: "like" | "dislike";
  createdAt?: Date;
  updatedAt?: Date;
}

const ReviewReactionSchema = new Schema<IReviewReaction>(
  {
    userId: {
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
    type: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
      ref: "Review"
    },
  },
  { timestamps: true }
);

ReviewReactionSchema.index(
  { reviewId: 1, userId: 1 },
  { unique: true }
);

const ReviewReaction: Model<IReviewReaction> =
  models.ReviewReaction ||
  mongoose.model<IReviewReaction>("ReviewReaction", ReviewReactionSchema);

export default ReviewReaction;
