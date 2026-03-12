import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email?: string;
  password?: string;
  studentType: 'platform' | 'online' | 'unassigned';
  accessibleTracks: mongoose.Types.ObjectId[];
  accessibleBooks: mongoose.Types.ObjectId[];
  accessibleExams: mongoose.Types.ObjectId[];
  role: 'admin' | 'student';
  accessCode?: string; // For students login
  isActive: boolean;
  phone?: string;
  parentPhone?: string;
  deviceId?: string;
  isBanned: boolean;
  banReason?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    role: {
      type: String,
      enum: ['admin', 'student'],
      default: 'student',
    },
    studentType: {
      type: String,
      enum: ['platform', 'online', 'unassigned'],
      default: 'unassigned',
    },
    accessibleTracks: [{ type: Schema.Types.ObjectId, ref: 'Track' }],
    accessibleBooks: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
    accessibleExams: [{ type: Schema.Types.ObjectId, ref: 'Exam' }],
    accessCode: { type: String, unique: true, sparse: true },
    isActive: { type: Boolean, default: true },
    phone: { type: String },
    parentPhone: { type: String },
    deviceId: { type: String },
    isBanned: { type: Boolean, default: false },
    banReason: { type: String },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
