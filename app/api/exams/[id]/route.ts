import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Exam from '@/models/Exam';
import ExamResult from '@/models/ExamResult';
import { authenticateRequest } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await authenticateRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const exam = await Exam.findById(params.id).select('-questions.correctOption');

        if (!exam) {
            return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
        }

        if (exam.isActive === false) {
            return NextResponse.json({ error: 'This exam is currently deactivated.' }, { status: 403 });
        }

        // Check scheduling
        const now = new Date();
        if (exam.startDate && now < new Date(exam.startDate)) {
            return NextResponse.json({ error: 'Exam has not started yet' }, { status: 403 });
        }
        if (exam.endDate && now > new Date(exam.endDate)) {
            return NextResponse.json({ error: 'Exam has already ended' }, { status: 403 });
        }

        // Check previous attempts
        const previousResult = await ExamResult.findOne({
            studentId: user.userId,
            examId: exam._id
        }).sort({ createdAt: -1 });

        if (exam.oneTimeAttempt && previousResult && !previousResult.isAllowedRetake) {
            return NextResponse.json({
                error: 'Single attempt allowed. Ask admin for retake permission.'
            }, { status: 403 });
        }

        return NextResponse.json(exam, { status: 200 });
    } catch (error: any) {
        console.error('Fetch exam error:', error);
        return NextResponse.json({ error: 'Failed to fetch exam' }, { status: 500 });
    }
}
