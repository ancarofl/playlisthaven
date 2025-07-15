-- CreateTable
CREATE TABLE "guest_session" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "spotify_token" TEXT,
    "youtube_token" TEXT,

    CONSTRAINT "guest_session_pkey" PRIMARY KEY ("id")
);
