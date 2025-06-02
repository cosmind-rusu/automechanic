-- AlterTable
ALTER TABLE "_VehicleEmployees" ADD CONSTRAINT "_VehicleEmployees_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_VehicleEmployees_AB_unique";
