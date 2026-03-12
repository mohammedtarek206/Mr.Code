import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authenticateRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'student') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { studentType } = await request.json();

        if (!['platform', 'online'].includes(studentType)) {
            return NextResponse.json({ error: 'Invalid student type' }, { status: 400 });
        }

        await connectDB();

        const updatedUser = await User.findByIdAndUpdate(
            (user as any).userId,
            { studentType },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Student type updated successfully',
            studentType: updatedUser.studentType
        });
    } catch (error: any) {
        console.error('Update type error:', error);
        return NextResponse.json(
            { error: 'Failed to update student type' },
            { status: 500 }
        );
    }
}
