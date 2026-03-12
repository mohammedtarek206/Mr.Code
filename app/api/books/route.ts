import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Book from '@/models/Book';
import User from '@/models/User';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const user = await authenticateRequest(request);

        let query: any = {};

        if (user && user.role === 'student') {
            const fullUser = await User.findById((user as any).userId || user.userId);
            query = {
                isActive: true,
                $or: [
                    { isPublic: true },
                    { _id: { $in: (fullUser as any)?.accessibleBooks || [] } }
                ]
            };
        } else if (!user) {
            query = { isActive: true, isPublic: true };
        }

        const books = await Book.find(query).sort({ createdAt: -1 });
        return NextResponse.json(books);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const userBuffer = await authenticateRequest(request);
        if (!userBuffer || userBuffer.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        await connectDB();
        const book = await Book.create(data);
        return NextResponse.json(book, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
