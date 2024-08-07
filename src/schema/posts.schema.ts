import * as mongoose from 'mongoose';

const PostsSchema = new mongoose.Schema(
  {
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    favorites: { type: Number, default: 0 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: 'posts',
  },
);

export { PostsSchema };
