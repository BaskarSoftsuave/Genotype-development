import * as mongoose from 'mongoose';

export const AdminUserSchema = new mongoose.Schema({
  _id: { type: String, default: mongoose.Types.ObjectId().toString() },
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  salt: String,
});