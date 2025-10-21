// ==========================================
// 3. API Route - GET & POST (app/api/characters/route.ts)
// ==========================================
// app/api/characters/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Character from '@/app/models/Character';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // TODO: Replace with actual auth
    const userId = 'temp-user-id';

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
      .sort({ createdAt: -1 })
      .lean();

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

    // TODO: Replace with actual auth
    const userId = 'temp-user-id';

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