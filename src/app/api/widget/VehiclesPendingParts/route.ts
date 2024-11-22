// /api/widget/vehiclesPendingParts.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const vehiclesPendingParts = await prisma.vehicle.findMany({
      where: {
        estado: 'Pendiente de piezas', // Asegúrate de establecer este estado en los datos
      },
      select: {
        id: true,
        propietario: true,
        marca: true,
        modelo: true,
        estado: true,
      },
    });
    return NextResponse.json({ vehicles: vehiclesPendingParts });
  } catch (error) {
    console.error('Error fetching vehicles pending parts:', error);
    return NextResponse.json({ error: 'Error fetching vehicles pending parts' }, { status: 500 });
  }
}
