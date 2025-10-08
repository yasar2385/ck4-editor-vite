import fs from "fs";
import { execSync } from "child_process";
import path from "path";

// --- Read and increment version.json ---
const versionPath = path.resolve("version.json");
const versionData = JSON.parse(fs.readFileSync(versionPath, "utf8"));
const [major, minor, patch] = versionData.version.split(".").map(Number);
const newVersion = `${major}.${minor}.${patch + 1}`;
versionData.version = newVersion;
fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2));
console.log(`📦 Version updated to v${newVersion}`);

// --- Add version info to environment ---
process.env.VITE_APP_VERSION = newVersion;

// --- Run Vite build ---
console.log("🏗️ Running Vite build...");
execSync("npm run build", { stdio: "inherit" });

// --- Create 7z archive ---
const buildFolder = path.resolve("dist");
const outputFile = `build-v${newVersion}.7z`;

console.log(`🗜️ Creating archive: ${outputFile}`);
execSync(`7z a ${outputFile} ${buildFolder}/*`, { stdio: "inherit" });

console.log("✅ Build and packaging complete!");
