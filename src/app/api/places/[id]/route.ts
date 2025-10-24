// ==========================================
// 3. API Route - PUT & DELETE (app/api/places/[id]/route.ts)
// ==========================================
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Place from '@/app/models/Places';
import mongoose from 'mongoose';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const userId = 'temp-user-id';
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid place ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const place = await Place.findOneAndUpdate(
      { _id: id, userId },
      {
        name: body.name,
        type: body.type,
        description: body.description,
        location: body.location,
        significance: body.significance,
        atmosphere: body.atmosphere,
        history: body.history,
        inhabitants: body.inhabitants,
        features: body.features,
      },
      { new: true, runValidators: true }
    );

    if (!place) {
      return NextResponse.json(
        { error: 'Place not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ place }, { status: 200 });
  } catch (error: any) {
    console.error('PUT /api/places/[id] error:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update place', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const userId = 'temp-user-id';
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid place ID' },
        { status: 400 }
      );
    }

    const place = await Place.findOneAndDelete({ _id: id, userId });

    if (!place) {
      return NextResponse.json(
        { error: 'Place not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Place deleted successfully', place },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE /api/places/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete place', details: error.message },
      { status: 500 }
    );
  }
}