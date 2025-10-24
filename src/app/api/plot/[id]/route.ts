// ==========================================
// 3. API Route - PUT & DELETE (app/api/places/[id]/route.ts)
// ==========================================

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Place from '@/app/models/Plot';
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

    const plot = await Place.findOneAndUpdate(
      { _id: id, userId },
      {
        description: body.description,
        beginning: body.beginning,
        middle: body.middle,
        end: body.end,
      },
      { new: true, runValidators: true }
    );

    if (!plot) {
      return NextResponse.json(
        { error: 'Not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ plot }, { status: 200 });
  } catch (error: any) {
    console.error('PUT /api/plot/[id] error:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update plot', details: error.message },
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

    const plot = await Place.findOneAndDelete({ _id: id, userId });

    if (!plot) {
      return NextResponse.json(
        { error: 'Not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Plot deleted successfully', plot },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE /api/plot/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete plot', details: error.message },
      { status: 500 }
    );
  }
}