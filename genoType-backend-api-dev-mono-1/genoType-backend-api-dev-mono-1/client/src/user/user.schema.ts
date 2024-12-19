const mongoose = require('mongoose');

export const UsersSchema = new mongoose.Schema({
  _id: { type: String, default: mongoose.Types.ObjectId().toString() },
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  licenceNo: String,
  salt: String,
  licenceId: String,
  createdAt: Date,
  modifiedAt: Date,
  deletedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

UsersSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
    this.modifiedAt = new Date();
  } else {
    this.modifiedAt = new Date();
  }
  next();
});
