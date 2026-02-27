import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AccessCode from '@/models/AccessCode';
import User from '@/models/User'; // Required for populate
import Track from '@/models/Track'; // Required for populate
import { authenticateRequest } from '@/lib/auth';

// Helper to generate a random code
function generateRandomCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function GET(request: NextRequest) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const codes = await AccessCode.find()
            .populate('studentId', 'name')
            .populate('trackId', 'title')
            .sort({ createdAt: -1 });

        console.log(`Fetched ${codes.length} codes`);
        return NextResponse.json(codes, { status: 200 });
    } catch (error: any) {
        console.error('Fetch codes error:', error);
        return NextResponse.json({ error: 'Failed to fetch codes: ' + error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { count = 1, trackId, expiresAt } = await request.json();
        await connectDB();

        const createdCodes = [];
        for (let i = 0; i < count; i++) {
            const codeStr = generateRandomCode(8);
            const accessCode = await AccessCode.create({
                code: codeStr,
                trackId: trackId || null,
                expiresAt: expiresAt || null,
            });
            createdCodes.push(accessCode);
        }

        return NextResponse.json(
            { message: `${count} codes generated successfully`, codes: createdCodes },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Code generation error:', error);
        return NextResponse.json({ error: 'Failed to generate codes' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const ids = searchParams.get('ids')?.split(',');

        await connectDB();

        if (ids && ids.length > 0) {
            await AccessCode.deleteMany({ _id: { $in: ids } });
            return NextResponse.json({ message: 'Codes deleted successfully' });
        } else if (id) {
            await AccessCode.findByIdAndDelete(id);
            return NextResponse.json({ message: 'Code deleted successfully' });
        }

        return NextResponse.json({ error: 'ID or IDs are required' }, { status: 400 });
    } catch (error: any) {
        console.error('Code deletion error:', error);
        return NextResponse.json({ error: 'Failed to delete code(s)' }, { status: 500 });
    }
}
