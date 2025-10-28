// ==========================================
// 3. API Route - PUT & DELETE (app/api/plots/[id]/route.ts)
// ==========================================
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Plot from '@/app/models/Plot';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }
    const userId = session.user.id;

    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid plot ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const plot = await Plot.findOneAndUpdate(
      { _id: id, userId },
      {
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
        imageUrl: body.imageUrl,
      },
      { new: true, runValidators: true }
    );

    if (!plot) {
      return NextResponse.json(
        { error: 'Plot not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ plot }, { status: 200 });
  } catch (error: any) {
    console.error('PUT /api/plots/[id] error:', error);

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
        { error: 'Invalid plot ID' },
        { status: 400 }
      );
    }

    const plot = await Plot.findOneAndDelete({ _id: id, userId });

    if (!plot) {
      return NextResponse.json(
        { error: 'Plot not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Plot deleted successfully', plot },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE /api/plots/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete plot', details: error.message },
      { status: 500 }
    );
  }
}