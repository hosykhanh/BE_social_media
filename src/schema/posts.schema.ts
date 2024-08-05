import * as mongoose from 'mongoose';

const PostsSchema = new mongoose.Schema(
  {
    image: { type: String, require: true },
    description: { type: String, default: '' },
    favorites: { type: Number, default: 0 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment',
    },
  },
  {
    timestamps: true,
    collection: 'posts',
  },
);

export { PostsSchema };
