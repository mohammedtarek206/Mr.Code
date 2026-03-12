import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
    title: string;
    description?: string;
    driveLink: string;
    category?: string;
    isActive: boolean;
    isPublic: boolean;
    createdAt: Date;
}

const BookSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        driveLink: { type: String, required: true },
        category: { type: String, default: 'General' },
        isActive: { type: Boolean, default: true },
        isPublic: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
