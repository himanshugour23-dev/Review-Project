import mongoose, { Schema, models, Model } from "mongoose";

export interface IGame {
  igdbId: number; // was rawgId
  slug: string;
  name: string;
  coverImage: string; // built from cover.image_id
  genres?: string[];
  released?: Date; // from first_release_date * 1000
  averageRating?: number; // your own users' average
  reviewCount?: number; // your own users' review count
  igdbRating?: number; // was rawgRating (0-100)
  metacritic?: number; // now holds aggregated_rating (critic score, 0-100)
  playtime?: number; // from game_time_to_beats (hours), optional
  platforms?: string[];
  lastFetched?: Date;
  detailsFetched?: boolean; // CHANGED: new flag
  createdAt?: Date;
  updatedAt?: Date;

  //  NEW (IGDB) 
  summary?: string;
  storyline?: string;
  totalRating?: number;
  totalRatingCount?: number;
  igdbRatingCount?: number;
  aggregatedRatingCount?: number;
  hypes?: number;
  category?: number; 
  parentGameId?: number;
  themes?: string[];
  gameModes?: string[];
  playerPerspectives?: string[];
  keywords?: string[];
  franchises?: string[];
  screenshots?: string[]; // image_ids
  artworks?: string[]; // image_ids
  videos?: { name?: string; videoId: string }[]; // YouTube ids
  similarGames?: {
    id: number;
    name: string;
    slug?: string;
    coverImage?: string;
  }[];

  igdbDetails?: {
    developers?: {
      id: number;
      name: string;
      slug?: string;
    }[];

    publishers?: {
      id: number;
      name: string;
      slug?: string;
    }[];

    websites?: {
      id: number;
      type?: number; 
      url: string;
    }[];

    dlc?: {
      id: number;
      name: string;
      slug: string;
      released?: Date;
      image?: string;
    }[];
  };
}

const GameSchema = new Schema<IGame>(
  {
    igdbId: {
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
    igdbRating: {
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

    summary: { type: String },
    storyline: { type: String },
    totalRating: { type: Number, default: 0 },
    totalRatingCount: { type: Number, default: 0 },
    igdbRatingCount: { type: Number, default: 0 },
    aggregatedRatingCount: { type: Number, default: 0 },
    hypes: { type: Number, default: 0 },
    category: { type: Number, index: true },
    parentGameId: { type: Number },
    themes: { type: [String] },
    gameModes: { type: [String] },
    playerPerspectives: { type: [String] },
    keywords: { type: [String] },
    franchises: { type: [String] },
    screenshots: { type: [String] },
    artworks: { type: [String] },
    videos: [
      {
        name: String,
        videoId: String,
      },
    ],
    similarGames: [
      {
        id: Number,
        name: String,
        slug: String,
        coverImage: String,
      },
    ],

    igdbDetails: {
      developers: [
        {
          id: Number,
          name: String,
          slug: String,
        },
      ],

      publishers: [
        {
          id: Number,
          name: String,
          slug: String,
        },
      ],

      websites: [
        {
          id: Number,
          type: { type: Number }, // CHANGED: "type" is reserved in Mongoose
          url: String,
        },
      ],

      dlc: [
        {
          id: Number,
          name: String,
          slug: String,
          released: Date,
          image: String,
        },
      ],
    },
    // Cache timestamp
    lastFetched: {
      type: Date, // CHANGED: removed default: Date.now
    },

    // CHANGED: true once full IGDB details are saved
    detailsFetched: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

GameSchema.index({ metacritic: -1, igdbRating: -1, released: -1 });

const IGDBGame: Model<IGame> = models.IGDBGame ||
  mongoose.model<IGame>( "IGDBGame", GameSchema,"igdb_games"
  );

export default IGDBGame;