import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  workshop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop',
    required: true
  },
  facilitator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resources: [{
    name: String,
    url: String
  }],
  recording: {
    type: String
  },
  attendance: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  notes: {
    type: String
  },
  qrCode: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
    
  }
});

const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

export default Session;