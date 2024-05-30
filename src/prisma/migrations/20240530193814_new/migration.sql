-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('INTERESTED', 'WILL_ATTEND');

-- CreateTable
CREATE TABLE "EventInteraction" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "InteractionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventInteraction_eventId_userId_type_key" ON "EventInteraction"("eventId", "userId", "type");

-- AddForeignKey
ALTER TABLE "EventInteraction" ADD CONSTRAINT "EventInteraction_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInteraction" ADD CONSTRAINT "EventInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
