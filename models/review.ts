import mongoose, { models, Schema, Model } from "mongoose";

export interface IReview {
  userId: mongoose.Types.ObjectId;
  gameId: mongoose.Types.ObjectId;
  rating: number;          
  reviewText?: string;     
  createdAt?: Date;
  updatedAt?: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0.5,
      max: 5,
    },
    reviewText: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: null, 
    },
  },
  {
    timestamps: true,
  }
);


ReviewSchema.index({ userId: 1, gameId: 1 }, { unique: true });

const Review: Model<IReview> =
  models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
