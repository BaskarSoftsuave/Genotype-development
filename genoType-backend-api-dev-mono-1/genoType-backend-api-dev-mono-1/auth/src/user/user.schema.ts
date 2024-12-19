import * as mongoose from 'mongoose';

export const AdminUserSchema = new mongoose.Schema({
  _id: { type: String, default: mongoose.Types.ObjectId().toString() },
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  salt: String,
});

export const UserSchema = new mongoose.Schema({
  _id: { type: String, default: mongoose.Types.ObjectId().toString() },
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  salt: String,
});

export const LicenseSchema = new mongoose.Schema({
  _id: { type: String, default: mongoose.Types.ObjectId().toString() },
  licenceNo: String,
  companyName: String,
  noOfUser: Number,
  isLifeLongLicence:Boolean,
  startDate: String,
  endDate: String,
  userIds: Array,
  createdAt: Date,
  modifiedAt: Date,
  deletedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedBy: String,
  deviceId: String,
});
