// api/forgot-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { usuario } = await req.json();

    if (!usuario) {
      return NextResponse.json({ error: 'Nombre de usuario es requerido' }, { status: 400 });
    }

    // Verifica si el usuario existe en la base de datos usando el campo `usuario`
    const user = await prisma.user.findUnique({
      where: { usuario },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Si el usuario existe, devuelve un mensaje de éxito
    return NextResponse.json({ message: 'Usuario verificado. Procede con el cambio de contraseña.' }, { status: 200 });
  } catch (error) {
    console.error("Error al verificar el usuario:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
