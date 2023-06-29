/*
  Warnings:

  - You are about to drop the `review` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cardExpiryMonth` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardExpiryYear` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardHolderName` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardNumber` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_userId_fkey`;

-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `cardExpiryMonth` INTEGER NOT NULL,
    ADD COLUMN `cardExpiryYear` INTEGER NOT NULL,
    ADD COLUMN `cardHolderName` VARCHAR(191) NOT NULL,
    ADD COLUMN `cardNumber` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `review`;

-- CreateTable
CREATE TABLE `Review` (
    `reviewId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `score` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Review_orderId_key`(`orderId`),
    PRIMARY KEY (`reviewId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`orderId`) ON DELETE RESTRICT ON UPDATE CASCADE;
