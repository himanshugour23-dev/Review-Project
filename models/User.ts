import mongoose, { Schema, Model, models } from "mongoose";

export interface IUser {
  provider: "google" | "github";
  providerId: string;
  email?: string;
  name: string;
  username ?: string ;
  
  avatar?: string;
  bio ?: string , 
  socials?: {
    github?: string;
    linkedin?: string;
    instagram?: string;
  };
  avatarPublicId?: string;

  favoriteGames : mongoose.Types.ObjectId[];

  role?: "user" | "admin";
  isBanned ?: boolean;
  banReason ?: string ;
  bannedAt ?: Date ;
  banExpiresAt ?: Date ;
  falseReportCount ?: number ;

  
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    provider: {
      type: String,
      required: true,
      enum: ["google", "github"],
    },
    providerId: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
      default : ""
    },
    bio : {
      type : String ,
      maxlength : 300
    },
   socials: {
      github: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      instagram: { type: String, trim: true },
    },
    avatarPublicId: {
      type: String,
      default: "",
    },

   favoriteGames: {
  type: [Schema.Types.ObjectId],
  ref: "Game",
  default: [],
},
  role : {
    type : String ,
    enum : ["user" , "admin"] ,
    default : "user"
  } ,
  isBanned : {
      type : Boolean ,
      default : false
  } , 
  banReason : {
    type : String , 
    default : ""
  },
  bannedAt : Date ,

  banExpiresAt : Date,

  falseReportCount : {
    type : Number,
    default : 0
  }

  },
  {
    timestamps: true,
  }
);

UserSchema.index(
  { provider: 1, providerId: 1 },
  { unique: true }
);

const User: Model<IUser> =
  models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
