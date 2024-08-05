import * as mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    posts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'posts',
    },
    content: { type: String, require: true },
    like: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: 'comment',
  },
);

export { CommentSchema };
