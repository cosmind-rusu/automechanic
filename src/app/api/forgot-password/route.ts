import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../../lib/email'; // Necesitarás crear esta función

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'No se encontró ningún usuario con este correo electrónico.' }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // Token válido por 1 hora

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    await sendPasswordResetEmail(user.email, resetToken);

    return NextResponse.json({ message: 'Se ha enviado un correo con instrucciones para restablecer tu contraseña.' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json({ error: 'Ocurrió un error al procesar tu solicitud.' }, { status: 500 });
  }
}