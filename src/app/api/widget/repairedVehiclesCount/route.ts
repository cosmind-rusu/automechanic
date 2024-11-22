import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  try {
    // Contar vehículos actualmente en reparación
    const currentCount = await prisma.vehicle.count({
      where: {
        estado: 'En reparación'
      }
    });

    // Contar vehículos en reparación hace una semana
    const previousCount = await prisma.vehicle.count({
      where: {
        estado: 'En reparación',
        updatedAt: {
          lte: oneWeekAgo
        }
      }
    });

    return NextResponse.json({
      currentCount,
      previousCount,
    });
  } catch (error) {
    console.error('Error fetching vehicle repair counts:', error);
    return NextResponse.json({ error: 'Error fetching vehicle repair counts' }, { status: 500 });
  }
}
