import * as mongoose from 'mongoose';

const ChatRoomSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    nameRoom: { type: String, default: '' },
  },
  {
    timestamps: true,
    collection: 'chatRoom',
  },
);

export { ChatRoomSchema };
