import { Document, Types } from "mongoose";

export interface UserType {
  username: string;
  bio?: string;
  birthday?: Date | null | string | null;
  email: string;
  gender: "male" | "female" | "non-binary";
  role?: "user" | "admin";
  interests?: string[];
  languages?: {
    language: string;
    proficiency:
      | "interested"
      | "beginner"
      | "intermediate"
      | "advanced"
      | "fluent"
      | "native";
  }[];
  location?: {
    state?: string;
    country?: string;
  };
  isVerified?: boolean;
  avatar?: string;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  zodaicSign?:
    | "Aries"
    | "Taurus"
    | "Gemini"
    | "Cancer"
    | "Leo"
    | "Virgo"
    | "Libra"
    | "Scorpio"
    | "Sagittarius"
    | "Capricorn"
    | "Aquarius"
    | "Pisces";
  isAcceptingDirectMessages?: boolean;
  friendRequests?: string[];
  friendList?: string[];
  blockedUsers?: string[];
  MatchingPreferences?: {
    targetGender: "male" | "female" | "non-binary";
    targetLanguages?: string[];
    targetZodaicSigns?: string[];
    targetLocation?: {
      city: string;
      country: string;
    };
    targetInterests?: string[];
  };
  joinedAt?: Date;
  messages?: MessageType[];
}

export interface MessageType extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  content: string;
  isRead: boolean;
  isDeleted: boolean;
}

export interface ConversationType extends Document {
  participants: Types.ObjectId[];
  messages: Types.ObjectId[];
}

export interface ApiResponse {
  message: string;
  success: boolean;
  data?: any;
}

export interface OTPType {
  email: string;
  otp: string;
  expiry: Date;
  uniqueId: string;
}

export interface SendEmailProps {
  username: string;
  email: string;
  verifyCode: string;
  
  
}
