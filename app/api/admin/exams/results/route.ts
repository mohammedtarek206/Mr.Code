import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ExamResult from '@/models/ExamResult';
import Exam from '@/models/Exam';
import User from '@/models/User';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Populate student and exam details
        const results = await ExamResult.find()
            .populate('studentId', 'name email grade')
            .populate('examId', 'title questions')
            .sort({ completedAt: -1 });

        return NextResponse.json(results);
    } catch (error) {
        console.error('Fetch results error:', error);
        return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { resultId, isAllowedRetake } = await request.json();
        if (!resultId) {
            return NextResponse.json({ error: 'Result ID required' }, { status: 400 });
        }

        await connectDB();
        const result = await ExamResult.findByIdAndUpdate(
            resultId,
            { isAllowedRetake },
            { new: true }
        );

        if (!result) {
            return NextResponse.json({ error: 'Result not found' }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Update result error:', error);
        return NextResponse.json({ error: 'Failed to update result' }, { status: 500 });
    }
}
