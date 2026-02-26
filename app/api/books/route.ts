import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Book from '@/models/Book';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const books = await Book.find({ isActive: true }).sort({ createdAt: -1 });
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
