/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[businessNumber]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessNumber` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closingTime` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cookingTime` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openingTime` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalNumber` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `review` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `store` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `averageScore` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `businessNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `closingTime` INTEGER NOT NULL,
    ADD COLUMN `cookingTime` INTEGER NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `openingTime` INTEGER NOT NULL,
    ADD COLUMN `origin` VARCHAR(191) NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `postalNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `registrationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `reviewNumber` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `status` ENUM('REGISTERED', 'OPEN', 'CLOSED', 'TERMINATED', 'OUT_OF_BUSINESS') NOT NULL,
    ADD COLUMN `type` ENUM('KOREAN', 'CHINESE', 'JAPANESE', 'WESTERN', 'CAFE') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Store_name_key` ON `Store`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Store_businessNumber_key` ON `Store`(`businessNumber`);

-- CreateIndex
CREATE INDEX `Store_name_type_idx` ON `Store`(`name`, `type`);
