-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "errors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stackTrace" TEXT,
    "errorType" TEXT,
    "browserInfo" TEXT,
    "url" TEXT,
    "fingerprint" TEXT NOT NULL,
    "occurredAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "breadcrumbs" TEXT,
    CONSTRAINT "errors_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "error_groups" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "firstSeen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL DEFAULT 1,
    "message" TEXT,
    "errorType" TEXT,
    CONSTRAINT "error_groups_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_apiKey_key" ON "projects"("apiKey");

-- CreateIndex
CREATE INDEX "errors_projectId_idx" ON "errors"("projectId");

-- CreateIndex
CREATE INDEX "errors_fingerprint_idx" ON "errors"("fingerprint");

-- CreateIndex
CREATE INDEX "errors_occurredAt_idx" ON "errors"("occurredAt");

-- CreateIndex
CREATE INDEX "error_groups_projectId_idx" ON "error_groups"("projectId");

-- CreateIndex
CREATE INDEX "error_groups_fingerprint_idx" ON "error_groups"("fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "error_groups_projectId_fingerprint_key" ON "error_groups"("projectId", "fingerprint");
