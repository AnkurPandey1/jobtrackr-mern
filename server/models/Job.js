const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    maxlength: 100,
    trim: true,
  },
  position: {
    type: String,
    required: [true, 'Please provide job title'],
    maxlength: 100,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Assessment', 'Offer', 'Rejected'],
    default: 'Applied',
    required: [true, 'Please provide application status'],
  },
  location: {
    type: String,
    required: [true, 'Please provide location'],
    default: 'Remote',
    trim: true,
  },
  salary: {
    type: Number,
    min: 0,
  },
  applicationDate: {
    type: Date,
    required: [true, 'Please provide application date'],
    default: Date.now,
  },
  deadline: {
    type: Date,
  },
  notes: {
    type: String,
    maxlength: 1000,
    trim: true,
  },
  jobLink: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
