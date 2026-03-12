import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authenticateRequest } from '@/lib/auth';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { action } = body;
        const { id } = params;

        await connectDB();

        const targetUser = await User.findById(id);
        if (!targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (action === 'activate') {
            targetUser.isActive = true;
        } else if (action === 'deactivate') {
            targetUser.isActive = false;
        } else if (action === 'unban') {
            targetUser.isBanned = false;
            targetUser.deviceId = undefined;
        } else if (action === 'updateDetails') {
            const { studentType, accessibleTracks, accessibleBooks, accessibleExams } = body;
            if (studentType) targetUser.studentType = studentType;
            if (accessibleTracks) targetUser.accessibleTracks = accessibleTracks;
            if (accessibleBooks) targetUser.accessibleBooks = accessibleBooks;
            if (accessibleExams) targetUser.accessibleExams = accessibleExams;
        }

        await targetUser.save();

        return NextResponse.json({ message: 'User status updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 });
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

        const { id } = params;
        await connectDB();

        const targetUser = await User.findById(id);
        if (!targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Don't allow deleting yourself (optional but safe)
        if (targetUser._id.toString() === user.userId) {
            return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
        }

        await User.findByIdAndDelete(id);

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
