import mongoose, { Schema, models, Model } from "mongoose";

export interface IGame {
  rawgId: number;
  slug: string;
  name: string;
  coverImage: string;
  genres?: string[];
  released?: Date;
  averageRating?: number;
  reviewCount?: number;
  rawgRating?: number;
  metacritic?: number;
  playtime?: number;
  platforms?: string[];
  lastFetched?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const GameSchema = new Schema<IGame>(
  {
    rawgId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    genres: {
      type: [String],
    },
    released: {
      type: Date,
    },

    averageRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    rawgRating: {
      type: Number,
      default: 0,
    },
    metacritic: {
      type: Number,
      default: 0,
    },
    playtime: {
      type: Number,
      default: 0,
    },
    platforms: {
      type: [String],
      index: true,
    },
    // Cache timestamp
    lastFetched: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

GameSchema.index({ metacritic: -1, rawgRating: -1, released: -1 });

const Game: Model<IGame> =
  models.Game || mongoose.model<IGame>("Game", GameSchema);

export default Game;
