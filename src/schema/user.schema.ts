import * as mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    maSo: { type: String, unique: true, sparse: true },
    career: { type: String, default: '' },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    gender: { type: String, default: 'Other' },
    dateOfBirth: { type: Date, default: new Date('2000-01-01T00:00:00Z') },
    phone: { type: Number, unique: true, sparse: true },
    address: { type: String },
    isAdmin: { type: Boolean, default: false },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/di5subxsf/image/upload/v1727855470/avatars/vwbwpthtm7azpmm442sr.jpg',
    },
    avatarKey: { type: String, default: null },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friendRequests: [
      {
        from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
      },
    ],
    otpSecret: { type: String, default: null },

    identityKey: { type: String, required: true }, // Base64 của public identity key
    registrationId: { type: Number, required: true },
    preKeys: [
      {
        keyId: { type: Number, required: true },
        publicKey: { type: String, required: true }, // Base64
      },
    ],
    signedPreKey: {
      keyId: { type: Number, required: true },
      publicKey: { type: String, required: true }, // Base64
      signature: { type: String, required: true }, // Base64
    },
    lastPreKeyId: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

// Middleware để kiểm tra confirmPassword
UserSchema.pre('save', function (next) {
  if (this.password !== this.confirmPassword) {
    return next(new Error('Passwords do not match'));
  }
  next();
});

export { UserSchema };
