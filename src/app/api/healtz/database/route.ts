import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Realiza una consulta sencilla para verificar la conexión a la base de datos
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    return NextResponse.json({ ok: false, error: "Database connection error" });
  } finally {
    await prisma.$disconnect();
  }
}
