import * as mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  gender: { type: String },
  dateOfBirth: { type: Date },
  phone: { type: Number },
  address: { type: String },
  isAdmin: { type: Boolean, default: false },
});

// Middleware để kiểm tra confirmPassword
UserSchema.pre('save', function (next) {
  if (this.password !== this.confirmPassword) {
    return next(new Error('Passwords do not match'));
  }
  next();
});

export { UserSchema };
