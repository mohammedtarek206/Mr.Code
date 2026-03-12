import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Track from '@/models/Track';
import Exam from '@/models/Exam';
import User from '@/models/User';
import { authenticateRequest } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const user = await authenticateRequest(request);

        const track = await Track.findById(params.id);

        if (!track) {
            return NextResponse.json({ error: 'Track not found' }, { status: 404 });
        }

        // Accessibility check for students
        if (user && user.role === 'student') {
            if (track.isActive === false) {
                return NextResponse.json({ error: 'This track is currently deactivatied' }, { status: 403 });
            }
            const fullUser = await User.findById((user as any).userId || user.userId);
            const isAccessible = track.isPublic || ((fullUser as any)?.accessibleTracks || []).map((id: any) => id.toString()).includes(track._id.toString());
            if (!isAccessible) {
                return NextResponse.json({ error: 'You do not have access to this track' }, { status: 403 });
            }

            // Filter exams: only active and (public or assigned)
            const assignedExams = ((fullUser as any)?.accessibleExams || []).map((id: any) => id.toString());
            const exams = await Exam.find({
                trackId: params.id,
                isActive: true,
                $or: [
                    { isPublic: true },
                    { _id: { $in: assignedExams } }
                ]
            });

            return NextResponse.json({
                ...track.toObject(),
                exams
            }, { status: 200 });
        }

        const exams = await Exam.find({ trackId: params.id });

        return NextResponse.json({
            ...track.toObject(),
            exams
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to fetch track' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        await connectDB();
        const track = await Track.findByIdAndUpdate(params.id, data, { new: true });

        if (!track) {
            return NextResponse.json({ error: 'Track not found' }, { status: 404 });
        }

        return NextResponse.json(track, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const track = await Track.findByIdAndDelete(params.id);

        if (!track) {
            return NextResponse.json({ error: 'Track not found' }, { status: 404 });
        }

        return NextResponse.json(
            { message: 'Track deleted successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
