import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Obtiene todos los empleados con roles de mecánico
    const mechanics = await prisma.user.findMany({
      where: {
        rol: {
          in: ['MECANICO', 'APRENDIZ', 'JEFE_MECANICO'], // Filtra roles relevantes
        },
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
      },
    });

    // Transforma los datos para que sean más claros en el frontend
    const transformedMechanics = mechanics.map((mechanic) => ({
      id: mechanic.id,
      name: `${mechanic.nombre} ${mechanic.apellido}`,
    }));

    return NextResponse.json(transformedMechanics);
  } catch (error) {
    console.error('Error fetching mechanics:', error);
    return NextResponse.json({ error: 'Error fetching mechanics' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
