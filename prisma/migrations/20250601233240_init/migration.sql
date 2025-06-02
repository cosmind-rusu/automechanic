/*
  Warnings:

  - The primary key for the `_VehicleEmployees` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_VehicleEmployees` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_VehicleEmployees" DROP CONSTRAINT "_VehicleEmployees_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_VehicleEmployees_AB_unique" ON "_VehicleEmployees"("A", "B");
