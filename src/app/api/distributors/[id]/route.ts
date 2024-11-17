import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const distributor = await prisma.distributor.findUnique({
      where: { id: params.id },
    });

    if (!distributor) {
      return NextResponse.json({ error: 'Distributor not found' }, { status: 404 });
    }

    return NextResponse.json(distributor);
  } catch (error) {
    console.error('Error fetching distributor:', error);
    return NextResponse.json({ error: 'Error fetching distributor' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const { nombre, telefono, direccion, imagen } = data;

    if (imagen && Buffer.byteLength(imagen, 'base64') > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'La imagen no debe superar los 5 MB' }, { status: 400 });
    }

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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.distributor.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Distributor deleted successfully' });
  } catch (error) {
    console.error('Error deleting distributor:', error);
    return NextResponse.json({ error: 'Error deleting distributor' }, { status: 500 });
  }
}
