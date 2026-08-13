-- CreateTable
CREATE TABLE "Bisnis" (
    "id" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "namaBisnis" TEXT NOT NULL,
    "jenisBisnis" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "vibe" TEXT NOT NULL,
    "ownerToken" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "ownerTokenUsedAt" TIMESTAMP(3),
    "logoUrl" TEXT,
    "coverUrl" TEXT,
    "instagram" TEXT,
    "tiktok" TEXT,
    "facebook" TEXT,
    "youtubeUrl" TEXT,
    "jamBuka" TEXT,
    "jamTutup" TEXT,
    "hariOperasional" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "customDomain" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bisnis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KontenWebsite" (
    "id" TEXT NOT NULL,
    "bisnisId" TEXT NOT NULL,
    "heroHeadline" TEXT NOT NULL,
    "heroSubtext" TEXT NOT NULL,
    "aboutParagraph" TEXT NOT NULL,
    "ctaText" TEXT NOT NULL,
    "seoTitle" TEXT NOT NULL,
    "seoDescription" TEXT NOT NULL,
    "accentColor" TEXT,
    "testimoni" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KontenWebsite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Layanan" (
    "id" TEXT NOT NULL,
    "bisnisId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "harga" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Layanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "bisnisId" TEXT NOT NULL,
    "path" TEXT NOT NULL DEFAULT '/',
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bisnis_customDomain_key" ON "Bisnis"("customDomain" ASC);

-- CreateIndex
CREATE INDEX "Bisnis_email_idx" ON "Bisnis"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Bisnis_ownerToken_key" ON "Bisnis"("ownerToken" ASC);

-- CreateIndex
CREATE INDEX "Bisnis_published_idx" ON "Bisnis"("published" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Bisnis_subdomain_key" ON "Bisnis"("subdomain" ASC);

-- CreateIndex
CREATE INDEX "Bisnis_vibe_idx" ON "Bisnis"("vibe" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "KontenWebsite_bisnisId_key" ON "KontenWebsite"("bisnisId" ASC);

-- CreateIndex
CREATE INDEX "Layanan_bisnisId_order_idx" ON "Layanan"("bisnisId" ASC, "order" ASC);

-- CreateIndex
CREATE INDEX "LoginToken_email_expiresAt_idx" ON "LoginToken"("email" ASC, "expiresAt" ASC);

-- CreateIndex
CREATE INDEX "LoginToken_expiresAt_idx" ON "LoginToken"("expiresAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "LoginToken_tokenHash_key" ON "LoginToken"("tokenHash" ASC);

-- CreateIndex
CREATE INDEX "PageView_bisnisId_createdAt_idx" ON "PageView"("bisnisId" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt" ASC);

-- AddForeignKey
ALTER TABLE "KontenWebsite" ADD CONSTRAINT "KontenWebsite_bisnisId_fkey" FOREIGN KEY ("bisnisId") REFERENCES "Bisnis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Layanan" ADD CONSTRAINT "Layanan_bisnisId_fkey" FOREIGN KEY ("bisnisId") REFERENCES "Bisnis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageView" ADD CONSTRAINT "PageView_bisnisId_fkey" FOREIGN KEY ("bisnisId") REFERENCES "Bisnis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

