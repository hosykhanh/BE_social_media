import * as mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    encryptedContents: [
      {
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: {
          type: new mongoose.Schema({
            type: Number,
            body: String,
            registrationId: Number,
          }),
        },
      },
    ],
    messageType: { type: String, default: '' },
  },
  {
    timestamps: true,
    collection: 'message',
  },
);

export { MessageSchema };
