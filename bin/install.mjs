#!/usr/bin/env node

import { existsSync, mkdirSync, copyFileSync, readdirSync, rmSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { homedir } from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, "..");
const srcSkillDir = join(packageRoot, "skills", "workflowy-triage");
const destSkillDir = join(homedir(), ".claude", "skills", "workflowy-triage");

const action = process.argv[2] || "install";

if (action === "uninstall") {
  if (existsSync(destSkillDir)) {
    rmSync(destSkillDir, { recursive: true });
    console.log(`Removed ${destSkillDir}`);
  } else {
    console.log("Nothing to uninstall.");
  }
} else {
  console.log("Installing workflowy-triage skill...\n");

  copyDir(srcSkillDir, destSkillDir);

  console.log(`\nInstalled to ${destSkillDir}\n`);
  console.log("Usage:");
  console.log("  /workflowy-triage <node-id>\n");
  console.log("Where <node-id> contains items to triage.");
  console.log("Claude will propose locations for each item based on your triage rules.");
}

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const s = join(src, entry.name);
    const d = join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      copyFileSync(s, d);
      console.log(`  ${d}`);
    }
  }
}
