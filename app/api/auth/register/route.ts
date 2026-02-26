import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role = 'student' } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (you'll need to create a User model)
    // For now, just return a token
    const token = jwt.sign(
      { email, role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    return NextResponse.json(
      { message: 'Registration successful', token },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
