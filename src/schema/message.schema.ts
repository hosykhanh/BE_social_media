import * as mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, require: true },
    messageType: { type: String, default: '' },
  },
  {
    timestamps: true,
    collection: 'message',
  },
);

export { MessageSchema };
