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
  friends: Types.ObjectId[];
  friendRequests: {
    from: Types.ObjectId;
    status: string;
  }[];
  otpSecret: string;
  publicKey: string;
  encryptedPrivateKey: string;
  iv: string;
  aesEncryptedKey: string;
}

export const UserModel = mongoose.model<User>('User', UserSchema);
