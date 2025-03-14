-- CreateTable
CREATE TABLE "User" (
    "userid" SERIAL NOT NULL,
    "cvurl" JSONB NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userid")
);
