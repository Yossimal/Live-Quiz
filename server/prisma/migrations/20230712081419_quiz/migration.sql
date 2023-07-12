/*
  Warnings:

  - You are about to drop the column `gameId` on the `player` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `question` table. All the data in the column will be lost.
  - You are about to drop the `game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `onlinegame` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quizId` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quizId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `game` DROP FOREIGN KEY `Game_creatorId_fkey`;

-- DropForeignKey
ALTER TABLE `onlinegame` DROP FOREIGN KEY `OnlineGame_gameId_fkey`;

-- DropForeignKey
ALTER TABLE `player` DROP FOREIGN KEY `Player_gameId_fkey`;

-- DropForeignKey
ALTER TABLE `question` DROP FOREIGN KEY `Question_gameId_fkey`;

-- AlterTable
ALTER TABLE `emailvalidationtokens` MODIFY `expiresAt` DATETIME(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 1 DAY);

-- AlterTable
ALTER TABLE `passwordresettokens` MODIFY `expiresAt` DATETIME(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 5 MINUTE);

-- AlterTable
ALTER TABLE `player` DROP COLUMN `gameId`,
    ADD COLUMN `quizId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `question` DROP COLUMN `gameId`,
    ADD COLUMN `quizId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `game`;

-- DropTable
DROP TABLE `onlinegame`;

-- CreateTable
CREATE TABLE `Quiz` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `creatorId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OnlineQuiz` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quizId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quiz` ADD CONSTRAINT `Quiz_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OnlineQuiz` ADD CONSTRAINT `OnlineQuiz_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Player` ADD CONSTRAINT `Player_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `OnlineQuiz`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
