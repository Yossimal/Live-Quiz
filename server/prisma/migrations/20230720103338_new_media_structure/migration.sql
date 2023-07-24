/*
  Warnings:

  - You are about to drop the column `media` on the `question` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `quiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `emailvalidationtokens` MODIFY `expiresAt` DATETIME(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 1 DAY);

-- AlterTable
ALTER TABLE `passwordresettokens` MODIFY `expiresAt` DATETIME(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 5 MINUTE);

-- AlterTable
ALTER TABLE `question` DROP COLUMN `media`,
    ADD COLUMN `mediaId` INTEGER NULL;

-- AlterTable
ALTER TABLE `quiz` DROP COLUMN `image`,
    ADD COLUMN `imageId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(191) NOT NULL,
    `type` ENUM('IMAGE', 'VIDEO', 'NONE') NOT NULL,
    `ownerId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `quizId` INTEGER NULL,

    UNIQUE INDEX `Media_path_key`(`path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quiz` ADD CONSTRAINT `Quiz_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
