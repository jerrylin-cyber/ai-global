#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");

// Read version from package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../package.json"), "utf8"),
);
const version = packageJson.version;

const configDir = path.join(os.homedir(), ".ai-global");

// Create config directory
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

console.log("");
console.log("\x1b[32m[OK]\x1b[0m AI Global v" + version + " installed!");
console.log("");
console.log(
  "Run \x1b[36mai-global\x1b[0m in ~ (or a project) directory to start.",
);
console.log("");
