// ==========================================
// 2. API Route - GET & POST (app/api/places/route.ts)
// ==========================================
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Place from '@/app/models/Places';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // TODO: Replace with actual auth
    const userId = 'temp-user-id';

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');

    let query: any = { userId };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const places = await Place.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ places }, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/places error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch places', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = 'temp-user-id';

    const body = await request.json();

    if (!body.name || !body.type || !body.description) {
      return NextResponse.json(
        { error: 'Name, type, and description are required' },
        { status: 400 }
      );
    }

    const place = await Place.create({
      userId,
      name: body.name,
      type: body.type,
      description: body.description,
      location: body.location,
      significance: body.significance,
      atmosphere: body.atmosphere,
      history: body.history,
      inhabitants: body.inhabitants,
      features: body.features,
      imageUrl: body.imageUrl
    });

    return NextResponse.json({ place }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/places error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create place', details: error.message },
      { status: 500 }
    );
  }
}
