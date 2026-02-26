import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FreeVideo from '@/models/FreeVideo';

export async function GET() {
    try {
        await connectDB();
        const videos = await FreeVideo.find().sort({ createdAt: -1 });
        return NextResponse.json(videos);
    } catch (error) {
        console.error('Fetch free videos error:', error);
        return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
    }
}
