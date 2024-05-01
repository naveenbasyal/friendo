import { UserType } from "@/types";
import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

const UserSchema: Schema<UserType> = new Schema<UserType>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
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

    bio: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    avatar: {
      type: String,
      default: `https://api.dicebear.com/8.x/lorelei-neutral/svg?seed=${Math.floor(
        Math.random() * 100
      )}`,
    },
    birthday: {
      type: Date,
    },
    gender: {
      type: String,
      required: [true, "gender is required"],
    },
    interests: {
      type: [String],
      default: [],
      enum: [],
    },

    location: {
      state: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    languages: [
      {
        language: {
          type: String,
        },
        proficiency: {
          type: String,

          enum: [
            "interested",
            "beginner",
            "intermediate",
            "advanced",
            "fluent",
            "native",
          ],
        },
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyCode: {
      type: String,
    },
    verifyCodeExpiry: {
      type: Date,
    },
    zodaicSign: {
      type: String,
    },
    isAcceptingDirectMessages: {
      type: Boolean,
      default: true,
    },
    // friendreuest should be a user
    friendRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendList: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blockedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    MatchingPreferences: {
      targetGender: {
        type: String,
      },
      targetLanguages: {
        type: [String],
        default: [],
        enum: [],
      },
      targetZodaicSigns: {
        type: [String],
        default: [],
        enum: [
          "Aries",
          "Taurus",
          "Gemini",
          "Cancer",
          "Leo",
          "Virgo",
          "Libra",
          "Scorpio",
          "Sagittarius",
          "Capricorn",
          "Aquarius",
          "Pisces",
        ],
      },
      targetLocation: {
        city: {
          type: String,
        },
        country: {
          type: String,
        },
      },
      targetInterests: {
        type: [String],
        default: [],
      },
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },

  {
    timestamps: true,
  }
);

const User =
  (mongoose.models.User as mongoose.Model<UserType>) ||
  mongoose.model<UserType>("User", UserSchema);

export default User;
