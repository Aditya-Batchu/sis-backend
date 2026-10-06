const mongoose = require('mongoose');

const campusSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Campus name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Campus code is required'],
      uppercase: true,
      trim: true,
      maxlength: [5, 'Campus code cannot exceed 5 characters'],
    },
    campusNumber: {
      type: String,
      trim: true,
      default: '',
    },
    region: {
      type: String,
      required: [true, 'Regional jurisdiction (AU or SVU) is required'],
      enum: {
        values: ['AU', 'SVU'],
        message: 'Regional jurisdiction must be either AU or SVU',
      },
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    contactEmail: {
      type: String,
      required: [true, 'Official administrative email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    directorName: {
      type: String,
      trim: true,
      default: '',
    },
    aoEmail: {
      type: String,
      trim: true,
      default: '',
    },
    deanAcademicsEmail: {
      type: String,
      trim: true,
      default: '',
    },
    coeEmail: {
      type: String,
      trim: true,
      default: '',
    },
    establishedYear: {
      type: Number,
      default: 2008,
    },
    annualIntake: {
      type: Number,
      default: 1100,
    },
    currentStrength: {
      type: Number,
      default: 7200,
    },
    landAreaAcres: {
      type: Number,
      default: 100,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Partial unique indexes so soft-deleted records do not collide with new records
campusSchema.index(
  { code: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

campusSchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

campusSchema.index({ region: 1, status: 1 });

module.exports = mongoose.model('Campus', campusSchema);
