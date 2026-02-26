import mongoose, { Document, Schema } from 'mongoose';

export interface IFreeVideo extends Document {
    title: string;
    description: string;
    youtubeId: string;
    createdAt: Date;
    updatedAt: Date;
}

const FreeVideoSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        youtubeId: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.FreeVideo || mongoose.model<IFreeVideo>('FreeVideo', FreeVideoSchema);
