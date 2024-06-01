import mongoose, { Document } from 'mongoose';
import { UserSchema } from 'src/schema/user.schema';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  date: Date;
  address: string;
}

export const UserModel = mongoose.model<User>('User', UserSchema);
