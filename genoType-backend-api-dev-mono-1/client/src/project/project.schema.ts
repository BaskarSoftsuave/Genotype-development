const mongoose = require('mongoose');

export const ProjectSchema = new mongoose.Schema({
  _id: { type: String, default: mongoose.Types.ObjectId().toString() },
  project_name: String,
  instrument_name: String,
  graph_type: String,
  plate_format: String,
  uploadedFileData: Array,
  calculatedData: Array,
  userId: String,
  ntc_calculation: {
    type: Boolean,
    default: false,
  },
  createdAt: Date,
  modifiedAt: Date,
  deletedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

ProjectSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
    this.modifiedAt = new Date();
    this.isDeleted = false;
  } else {
    this.modifiedAt = new Date();
  }
  next();
});
