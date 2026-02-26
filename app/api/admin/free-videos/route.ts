import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FreeVideo from '@/models/FreeVideo';
import { authenticateRequest } from '@/lib/auth';

const verifyAdmin = async (req: NextRequest) => {
    try {
        const user = await authenticateRequest(req);
        if (!user || user.role !== 'admin') return null;
        return user;
    } catch (error) {
        return null;
    }
};

export async function POST(req: NextRequest) {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectDB();
        const { title, description, youtubeId } = await req.json();

        if (!title || !description || !youtubeId) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const video = await FreeVideo.create({ title, description, youtubeId });
        return NextResponse.json(video, { status: 201 });
    } catch (error) {
        console.error('Add free video error:', error);
        return NextResponse.json({ error: 'Failed to add video' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await FreeVideo.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Delete free video error:', error);
        return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
    }
}
