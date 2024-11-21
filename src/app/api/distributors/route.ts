import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const skip = (page - 1) * limit;

  try {
    const [distributors, total] = await Promise.all([
      prisma.distributor.findMany({
        skip,
        take: limit,
        orderBy: { nombre: 'asc' },
      }),
      prisma.distributor.count(),
    ]);

    return NextResponse.json({
      distributors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching distributors:', error);
    return NextResponse.json({ error: 'Error fetching distributors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { nombre, telefono, direccion, imagen } = data;

    const newDistributor = await prisma.distributor.create({
      data: { nombre, telefono, direccion, imagen },
    });

    return NextResponse.json(newDistributor);
  } catch (error) {
    console.error('Error creating distributor:', error);
    return NextResponse.json({ error: 'Error creating distributor' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const { nombre, telefono, direccion, imagen } = data;

    const updatedDistributor = await prisma.distributor.update({
      where: { id: params.id },
      data: { nombre, telefono, direccion, imagen },
    });

    return NextResponse.json(updatedDistributor);
  } catch (error) {
    console.error('Error updating distributor:', error);
    return NextResponse.json({ error: 'Error updating distributor' }, { status: 500 });
  }
}
