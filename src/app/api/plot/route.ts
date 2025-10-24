// ==========================================
// 2. API Route - GET and POST (app/api/plot/route.ts)
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Plot from "@/app/models/Plot";

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
        { description: { $regex: search, $options: 'i' } },
        { beginning: { $regex: search, $options: 'i' } },
        { middle: { $regex: search, $options: 'i' } },
        { end: { $regex: search, $options: 'i' } },
      ];
    }

    const plot = await Plot.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ plot }, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/plot error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plot', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = 'temp-user-id';

    const body = await request.json();

    if (!body.description) {
      return NextResponse.json(
        { error: 'Description are required' },
        { status: 400 }
      );
    }

    const plot = await Plot.create({
      userId,
      description: body.description,
      beginning: body.beginning,
      middle: body.middle,
      end: body.end,
    });

    return NextResponse.json({ plot }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/plot error:', error);
    
    if (error.description === 'ValidationError') {
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
