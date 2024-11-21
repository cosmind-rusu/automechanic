import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const items = await prisma.inventoryItem.findMany({
      include: {
        alerts: {
          where: {
            resolvedAt: null, // Solo alertas activas
          },
          select: {
            id: true,
            message: true,
            currentQty: true,
            minQty: true,
            createdAt: true,
          },
        },
      },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return NextResponse.json({ error: 'Error fetching inventory items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newItem = await prisma.inventoryItem.create({ data });

    // Verificar si se necesita crear una alerta
    if (newItem.quantity <= newItem.minQuantity) {
      await prisma.inventoryAlert.create({
        data: {
          itemId: newItem.id,
          currentQty: newItem.quantity,
          minQty: newItem.minQuantity,
          message: `La cantidad del inventario está por debajo del mínimo (${newItem.minQuantity})`,
        },
      });
    }

    return NextResponse.json(newItem);
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return NextResponse.json({ error: 'Error creating inventory item' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, quantityChange } = await request.json();
    const item = await prisma.inventoryItem.update({
      where: { id },
      data: { quantity: { increment: quantityChange } },
    });

    // Verificar si la alerta necesita crearse o resolverse
    if (item.quantity <= item.minQuantity) {
      const activeAlert = await prisma.inventoryAlert.findFirst({
        where: { itemId: id, resolvedAt: null },
      });

      if (!activeAlert) {
        await prisma.inventoryAlert.create({
          data: {
            itemId: id,
            currentQty: item.quantity,
            minQty: item.minQuantity,
            message: `La cantidad del inventario está por debajo del mínimo (${item.minQuantity})`,
          },
        });
      }
    } else {
      await prisma.inventoryAlert.updateMany({
        where: { itemId: id, resolvedAt: null },
        data: { resolvedAt: new Date() },
      });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating quantity:', error);
    return NextResponse.json({ error: 'Error updating quantity' }, { status: 500 });
  }
}
