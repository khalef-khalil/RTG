-- AlterTable
ALTER TABLE "challenges" ADD COLUMN "biggestObstacle" TEXT;
ALTER TABLE "challenges" ADD COLUMN "improvement" TEXT;
ALTER TABLE "challenges" ADD COLUMN "pushRating" INTEGER;

-- CreateTable
CREATE TABLE "focus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "source" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
