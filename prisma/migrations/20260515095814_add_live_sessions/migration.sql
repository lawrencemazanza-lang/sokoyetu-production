-- CreateTable
CREATE TABLE "LiveSession" (
    "id" SERIAL NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "sellerName" TEXT NOT NULL,
    "sellerEmail" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "offerText" TEXT,
    "productId" INTEGER,
    "productName" TEXT,
    "roomName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'LIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "LiveSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LiveSession_roomName_key" ON "LiveSession"("roomName");
