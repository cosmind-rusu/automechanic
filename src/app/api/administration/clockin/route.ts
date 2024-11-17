// src/app/api/administration/clockin/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Función para obtener el inicio de la semana
function getStartOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajusta para que la semana comience en lunes
  return new Date(date.setDate(diff));
}

// Función para obtener el final de la semana
function getEndOfWeek(startOfWeek: Date): Date {
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6); // Final de semana es seis días después del inicio
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const weekStartParam = searchParams.get('weekStart');
  const weekStart = weekStartParam ? new Date(weekStartParam) : getStartOfWeek(new Date());
  const weekEnd = getEndOfWeek(weekStart);

  const clockInRecords = await prisma.clockIn.findMany({
    where: {
      clockIn: {
        gte: weekStart,
        lt: weekEnd,
      },
    },
    orderBy: {
      clockIn: 'asc',
    },
  });

  return NextResponse.json(clockInRecords);
}
