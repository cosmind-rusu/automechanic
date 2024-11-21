import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todas las alertas
export async function GET() {
  try {
    const alerts = await prisma.generalAlert.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json({ error: 'Error fetching alerts' }, { status: 500 });
  }
}

// Crear una nueva alerta
export async function POST(request: Request) {
  try {
    const { titulo, mensaje, severity } = await request.json();
    const newAlert = await prisma.generalAlert.create({
      data: { titulo, mensaje, severity },
    });
    return NextResponse.json(newAlert);
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json({ error: 'Error creating alert' }, { status: 500 });
  }
}

// Actualizar una alerta
export async function PUT(request: Request) {
  try {
    const { id, titulo, mensaje, activa, severity } = await request.json();
    const updatedAlert = await prisma.generalAlert.update({
      where: { id },
      data: { titulo, mensaje, activa, severity },
    });
    return NextResponse.json(updatedAlert);
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json({ error: 'Error updating alert' }, { status: 500 });
  }
}

// Eliminar una alerta
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.generalAlert.delete({ where: { id } });
    return NextResponse.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return NextResponse.json({ error: 'Error deleting alert' }, { status: 500 });
  }
}
