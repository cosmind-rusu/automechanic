import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const updatedItem = await prisma.inventoryItem.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return NextResponse.json({ error: 'Error updating inventory item' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.inventoryItem.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return NextResponse.json({ error: 'Error deleting inventory item' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { quantityChange } = await request.json();
    const item = await prisma.inventoryItem.findUnique({
      where: { id: params.id },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const updatedItem = await prisma.inventoryItem.update({
      where: { id: params.id },
      data: { quantity: item.quantity + quantityChange },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating inventory item quantity:', error);
    return NextResponse.json({ error: 'Error updating inventory item quantity' }, { status: 500 });
  }
}