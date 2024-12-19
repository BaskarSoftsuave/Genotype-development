const mongoose = require('mongoose');
import { UsersSchema } from '../user/user.schema';
const userModel = mongoose.model('UsersModel', UsersSchema);

export const licenceSchema = new mongoose.Schema({
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

licenceSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
    this.modifiedAt = new Date();
    this.isVerified = false;
  } else {
    this.modifiedAt = new Date();
  }
  next();
});

