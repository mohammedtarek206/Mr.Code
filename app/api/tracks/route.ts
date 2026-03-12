import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Track from '@/models/Track';
import User from '@/models/User';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateRequest(request);

    let query: any = { isActive: true };

    // If student, filter by public or specifically assigned tracks
    if (user && user.role === 'student') {
      const fullUser = await User.findById((user as any).userId || user.userId);
      query = {
        isActive: true,
        $or: [
          { isPublic: true },
          { _id: { $in: (fullUser as any)?.accessibleTracks || [] } }
        ]
      };
    }

    const tracks = await Track.find(query).sort({ createdAt: -1 });
    return NextResponse.json(tracks, { status: 200 });
  } catch (error: any) {
    console.error('Tracks API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    await connectDB();

    const track = new Track(data);
    await track.save();

    return NextResponse.json(
      { message: 'Track added successfully', id: track._id },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to add track' },
      { status: 500 }
    );
  }
}
