// /api/widget/employeeVehiclesCount.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.user.findMany({
      where: {
        rol: {
          in: ['MECANICO', 'JEFE_MECANICO', 'APRENDIZ'], // Roles relevantes
        },
      },
      select: {
        nombre: true,
        apellido: true,
        _count: {
          select: {
            vehiculosAsignados: true, // Relación correcta basada en el esquema
          },
        },
      },
    });

    const result = data.map((user) => ({
      employee: `${user.nombre} ${user.apellido}`,
      count: user._count.vehiculosAsignados, // Usamos la relación correcta
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching employee vehicles count:', error);
    return NextResponse.json({ error: 'Error fetching employee vehicles count' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
