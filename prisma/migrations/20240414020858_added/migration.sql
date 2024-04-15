-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT,
ALTER COLUMN "token" DROP NOT NULL;
