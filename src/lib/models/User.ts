import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['coordinado', 'consultor', 'admin'],
    default: 'coordinado',
  },
  otp: {
    code: String,
    expiresAt: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  downloads: [{
    paperId: String,
    downloadedAt: {
      type: Date,
      default: Date.now,
    }
  }],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
