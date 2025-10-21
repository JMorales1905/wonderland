// ==========================================
// 3. API Route - GET & POST (app/api/characters/route.ts)
// ==========================================
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Character from '@/app/models/Character';
//import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Adjust based on your auth setup

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get user session - adjust based on your auth implementation
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // const userId = session.user.id;

    // For now, using a placeholder - replace with actual user ID from your auth
    const userId = 'temp-user-id'; // TODO: Replace with actual auth

    // Get search query parameter
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');

    let query: any = { userId };

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const characters = await Character.find(query)
      .sort({ createdAt: -1 }) // Most recent first
      .lean(); // Convert to plain JavaScript objects

    return NextResponse.json({ characters }, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/characters error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch characters', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get user session
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // const userId = session.user.id;

    const userId = 'temp-user-id'; // TODO: Replace with actual auth

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.role || !body.description) {
      return NextResponse.json(
        { error: 'Name, role, and description are required' },
        { status: 400 }
      );
    }

    // Create new character
    const character = await Character.create({
      userId,
      name: body.name,
      age: body.age,
      role: body.role,
      description: body.description,
      background: body.background,
      personality: body.personality,
      appearance: body.appearance,
      relationships: body.relationships,
      motivations: body.motivations,
    });

    return NextResponse.json({ character }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/characters error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create character', details: error.message },
      { status: 500 }
    );
  }
}
