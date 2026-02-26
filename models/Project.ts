import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  summary?: string;
  imageUrl: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  studentName?: string; // Added studentName
  demoUrl?: string; // Added demoUrl
  projectLink?: string; // Added projectLink
  description: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    summary: { type: String },
    imageUrl: { type: String, required: true },
    tags: [{ type: String }],
    githubUrl: { type: String },
    liveUrl: { type: String },
    studentName: { type: String }, // Added studentName
    demoUrl: { type: String }, // Added demoUrl
    projectLink: { type: String }, // Added projectLink
    description: { type: String, required: true },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
