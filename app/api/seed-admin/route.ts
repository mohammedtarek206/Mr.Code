import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            return NextResponse.json({ message: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            name: 'Main Admin',
            email: 'admin@mrcode.com',
            password: hashedPassword,
            role: 'admin',
            isActive: true
        });

        return NextResponse.json({
            message: 'Admin account created successfully',
            credentials: {
                email: 'admin@mrcode.com',
                password: 'admin123'
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
