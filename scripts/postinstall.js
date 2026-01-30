#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");

const BLUE = "\x1b[34m";
const GREEN = "\x1b[32m";
const GRAY = "\x1b[90m";
const NC = "\x1b[0m";

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
console.log(`${GREEN}[OK]${NC} AI Global v${version} installed!`);
console.log("");
console.log(
  `Run ${BLUE}ai-global${NC} in ~ ${GRAY}(or a project)${NC} directory to start.`,
);
console.log("");
