/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentStatus` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_paymentId_fkey`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `paymentId`,
    ADD COLUMN `status` ENUM('PAYMENT_PROCESSING', 'PAYMENT_FAIL', 'ORDER_RECEIVED', 'ORDER_CONFIRMED', 'DELIVERY_STARTED', 'DELIVERED', 'CANCEL_REQUESTED', 'CANCELED') NOT NULL DEFAULT 'PAYMENT_PROCESSING',
    MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `orderId` INTEGER NOT NULL,
    ADD COLUMN `paymentStatus` ENUM('completed', 'canceled') NOT NULL;

-- CreateTable
CREATE TABLE `OrderItem` (
    `orderItemId` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `menuId` INTEGER NOT NULL,

    PRIMARY KEY (`orderItemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Payment_orderId_key` ON `Payment`(`orderId`);

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`orderId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`menuId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`orderId`) ON DELETE RESTRICT ON UPDATE CASCADE;
