-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Proposal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientCompany" TEXT,
    "projectTitle" TEXT NOT NULL,
    "projectDescription" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "startDate" TEXT,
    "deliverables" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "executiveSummary" TEXT NOT NULL,
    "scopeOfWork" TEXT NOT NULL,
    "pricingBreakdown" TEXT NOT NULL,
    "timelineDetails" TEXT NOT NULL,
    "termsAndConditions" TEXT NOT NULL,
    "freelancerSignatureType" TEXT,
    "freelancerSignatureData" TEXT,
    "freelancerSignedAt" DATETIME,
    "clientSignatureType" TEXT,
    "clientSignatureData" TEXT,
    "clientSignedAt" DATETIME,
    "signatureStatus" TEXT NOT NULL DEFAULT 'not_started',
    "signatureToken" TEXT,
    "verificationCode" TEXT,
    "verificationCodeExpiry" DATETIME,
    "clientEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "contentHash" TEXT,
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    CONSTRAINT "Proposal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Proposal" ("budget", "clientCompany", "clientEmail", "clientName", "clientSignatureData", "clientSignatureType", "clientSignedAt", "createdAt", "deliverables", "executiveSummary", "freelancerSignatureData", "freelancerSignatureType", "freelancerSignedAt", "id", "pricingBreakdown", "projectDescription", "projectTitle", "scopeOfWork", "signatureStatus", "signatureToken", "startDate", "status", "termsAndConditions", "timeline", "timelineDetails", "userId") SELECT "budget", "clientCompany", "clientEmail", "clientName", "clientSignatureData", "clientSignatureType", "clientSignedAt", "createdAt", "deliverables", "executiveSummary", "freelancerSignatureData", "freelancerSignatureType", "freelancerSignedAt", "id", "pricingBreakdown", "projectDescription", "projectTitle", "scopeOfWork", "signatureStatus", "signatureToken", "startDate", "status", "termsAndConditions", "timeline", "timelineDetails", "userId" FROM "Proposal";
DROP TABLE "Proposal";
ALTER TABLE "new_Proposal" RENAME TO "Proposal";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
