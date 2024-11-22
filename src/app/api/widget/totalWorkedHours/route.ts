// /api/widget/totalWorkedHours.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic'; // Marcar como ruta dinámica

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.name) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }

    const username = session.user.name;

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const clockIns = await prisma.clockIn.findMany({
      where: {
        usuario: username,
        clockIn: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      select: {
        clockIn: true,
        clockOut: true,
      },
    });

    const totalHours = clockIns.reduce((acc, entry) => {
      const clockOut = entry.clockOut || new Date();
      const hours = (clockOut.getTime() - entry.clockIn.getTime()) / (1000 * 60 * 60);
      return acc + hours;
    }, 0);

    return NextResponse.json({ totalHours: Math.round(totalHours * 100) / 100 });
  } catch (error) {
    console.error('Error fetching total worked hours:', error);
    return NextResponse.json({ error: 'Error fetching total worked hours' }, { status: 500 });
  }
}
