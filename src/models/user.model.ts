import mongoose, { Document, Types } from 'mongoose';
import { UserSchema } from 'src/schema/user.schema';

export interface User extends Document {
  maSo: string;
  career: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  dateOfBirth: Date;
  phone: number;
  address: string;
  isAdmin: boolean;
  avatar: string;
  avatarKey: string;
  friends: Types.ObjectId[];
  friendRequests: {
    from: Types.ObjectId;
    status: string;
  }[];
  otpSecret: string;

  identityKey: string; // Base64 của public identity key
  registrationId: number;
  preKeys: {
    keyId: number;
    publicKey: string; // Base64
  }[];
  signedPreKey: {
    keyId: number;
    publicKey: string; // Base64
    signature: string; // Base64
  };
}

export const UserModel = mongoose.model<User>('User', UserSchema);
