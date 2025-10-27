// ==========================================
// 2. API Route - GET & POST (app/api/plots/route.ts)
// ==========================================
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Plot from '@/app/models/Plot';

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
        { title: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const plots = await Plot.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ plots }, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/plots error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plots', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = 'temp-user-id';

    const body = await request.json();

    if (!body.title || !body.type || !body.description) {
      return NextResponse.json(
        { error: 'Title, type, and description are required' },
        { status: 400 }
      );
    }

    const plot = await Plot.create({
      userId,
      title: body.title,
      chapter: body.chapter,
      type: body.type,
      description: body.description,
      timeframe: body.timeframe,
      location: body.location,
      characters: body.characters,
      significance: body.significance,
      conflicts: body.conflicts,
      resolution: body.resolution,
      notes: body.notes,
    });

    return NextResponse.json({ plot }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/plots error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create plot', details: error.message },
      { status: 500 }
    );
  }
}