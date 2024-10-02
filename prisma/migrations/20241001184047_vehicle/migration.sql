-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "propietario" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "cilindrada" INTEGER NOT NULL,
    "combustible" TEXT NOT NULL,
    "kilometraje" INTEGER NOT NULL,
    "bastidor" TEXT NOT NULL,
    "comentarios" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'En reparación',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_VehicleEmployees" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_bastidor_key" ON "Vehicle"("bastidor");

-- CreateIndex
CREATE UNIQUE INDEX "_VehicleEmployees_AB_unique" ON "_VehicleEmployees"("A", "B");

-- CreateIndex
CREATE INDEX "_VehicleEmployees_B_index" ON "_VehicleEmployees"("B");

-- AddForeignKey
ALTER TABLE "_VehicleEmployees" ADD CONSTRAINT "_VehicleEmployees_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VehicleEmployees" ADD CONSTRAINT "_VehicleEmployees_B_fkey" FOREIGN KEY ("B") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
