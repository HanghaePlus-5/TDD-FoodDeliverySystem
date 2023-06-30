/*
  Warnings:

  - Added the required column `paymentGatewayId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `paymentGatewayId` VARCHAR(191) NOT NULL;
