import { ConversationType } from "@/types";
import mongoose, { Schema } from "mongoose";

const ConversationSchema: Schema<ConversationType> =
  new Schema<ConversationType>(
    {
      participants: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      messages: [
        {
          type: Schema.Types.ObjectId,
          ref: "Message",
          default: [],
        },
      ],
    },
    {
      timestamps: true,
    }
  );

const Conversation =
  (mongoose.models.Conversation as mongoose.Model<ConversationType>) ||
  mongoose.model<ConversationType>("Conversation", ConversationSchema);

export default Conversation;
