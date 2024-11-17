// app/api/reset-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { usuario, newPassword } = await req.json();

    if (!usuario || !newPassword) {
      return NextResponse.json(
        { error: 'Nombre de usuario y nueva contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Verifica si el usuario existe en la base de datos
    const user = await prisma.user.findUnique({
      where: { usuario },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Hashea la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualiza la contraseña en la base de datos
    await prisma.user.update({
      where: { usuario },
      data: { password: hashedPassword },
    });

    // Devuelve un mensaje de éxito
    return NextResponse.json(
      { message: 'Contraseña actualizada correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
