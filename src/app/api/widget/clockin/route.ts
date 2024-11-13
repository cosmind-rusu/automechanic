import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { usuario, action } = await request.json();

  console.log("Usuario recibido:", usuario);
  console.log("Acción recibida:", action);

  if (action === 'clockIn') {
    // Crear un nuevo registro de entrada usando el nombre de usuario
    const clockIn = await prisma.clockIn.create({
      data: {
        usuario,
      },
    });
    return NextResponse.json({ success: true, clockIn });
  } else if (action === 'clockOut') {
    // Actualizar el registro de salida
    const clockIn = await prisma.clockIn.findFirst({
      where: {
        usuario,
        clockOut: null,
      },
      orderBy: {
        clockIn: 'desc',
      },
    });

    if (!clockIn) {
      return NextResponse.json({ success: false, message: 'No se encontró una entrada activa para el usuario' });
    }

    const updatedClockIn = await prisma.clockIn.update({
      where: { id: clockIn.id },
      data: { clockOut: new Date() },
    });

    return NextResponse.json({ success: true, updatedClockIn });
  }

  return NextResponse.json({ success: false, message: 'Acción inválida' });
}
