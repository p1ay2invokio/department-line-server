-- CreateTable
CREATE TABLE "List" (
    "id" SERIAL NOT NULL,
    "product" TEXT,
    "sender" TEXT,
    "department" TEXT,
    "status" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);
