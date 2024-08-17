import * as mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema(
  {
    isLike: { type: Boolean, default: false },
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
    collection: 'like',
  },
);

export { LikeSchema };
