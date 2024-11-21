/*
  Warnings:

  - Added the required column `currentQty` to the `InventoryAlert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minQty` to the `InventoryAlert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InventoryAlert" ADD COLUMN     "currentQty" INTEGER NOT NULL,
ADD COLUMN     "minQty" INTEGER NOT NULL,
ADD COLUMN     "resolvedAt" TIMESTAMP(3);
