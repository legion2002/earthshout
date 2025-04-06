/*
  Warnings:

  - You are about to drop the `messages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "messages";

-- CreateTable
CREATE TABLE "earthshouts" (
    "id" SERIAL NOT NULL,
    "sender_address" VARCHAR(42) NOT NULL,
    "yeet_id" INTEGER NOT NULL,
    "token_address" VARCHAR(42) NOT NULL,
    "amount_burned" DOUBLE PRECISION NOT NULL,
    "transaction_hash" VARCHAR(66) NOT NULL,
    "block_number" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT,
    "recipient_address" VARCHAR(42),
    "gift_amount" DOUBLE PRECISION,
    "boost_for_yeet_id" INTEGER,

    CONSTRAINT "earthshouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "earthshouts_transaction_hash_key" ON "earthshouts"("transaction_hash");
