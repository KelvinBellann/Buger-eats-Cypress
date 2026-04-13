const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..", "..");
const blockedFileNames = new Set([".env"]);
const blockedPatterns = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bghp_[A-Za-z0-9]{20,}\b/,
  /\bglpat-[A-Za-z0-9\-_]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
];
const ignoredSegments = ["node_modules", ".git", "cypress\\videos", "cypress\\screenshots"];

function shouldIgnore(targetPath) {
  return ignoredSegments.some((segment) => targetPath.includes(segment));
}

function collectFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (shouldIgnore(fullPath)) {
      return [];
    }

    if (entry.isDirectory()) {
      return collectFiles(fullPath);
    }

    return [fullPath];
  });
}

const findings = [];
for (const file of collectFiles(rootDir)) {
  const baseName = path.basename(file);

  if (blockedFileNames.has(baseName)) {
    findings.push(`Committed sensitive env file: ${path.relative(rootDir, file)}`);
    continue;
  }

  const content = fs.readFileSync(file, "utf8");
  blockedPatterns.forEach((pattern) => {
    if (pattern.test(content)) {
      findings.push(`Potential secret pattern ${pattern} found in ${path.relative(rootDir, file)}`);
    }
  });
}

if (findings.length > 0) {
  console.error("Security configuration check failed:");
  findings.forEach((finding) => console.error(`- ${finding}`));
  process.exit(1);
}

console.log("Security configuration check passed.");
