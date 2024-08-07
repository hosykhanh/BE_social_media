import * as mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, default: '' },
    image: { type: String, default: '' },
    like: { type: Number, default: 0 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    posts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Posts',
    },
  },
  {
    timestamps: true,
    collection: 'comment',
  },
);

export { CommentSchema };
