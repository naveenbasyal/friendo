import { MessageType } from "@/types";
import mongoose, {  Schema } from "mongoose";

const MessageSchema: Schema<MessageType> = new Schema<MessageType>(

  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Message =
  (mongoose.models.Message as mongoose.Model<MessageType>) ||
  mongoose.model<MessageType>("Message", MessageSchema);

export default Message;
