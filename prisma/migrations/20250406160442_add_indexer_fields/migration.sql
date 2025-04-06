-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "block_number" INTEGER,
ADD COLUMN     "indexed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "token_address" VARCHAR(42),
ADD COLUMN     "yeet_id" INTEGER;

-- CreateTable
CREATE TABLE "indexer_state" (
    "id" SERIAL NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "last_block_number" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "indexer_state_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "indexer_state_chain_id_key" ON "indexer_state"("chain_id");
