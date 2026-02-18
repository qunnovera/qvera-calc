import { copyFileSync, mkdirSync } from "fs";
import { join } from "path";

const cmd = process.argv[2];
const isDev = process.argv.includes("--dev");
const outDir = isDev ? "npm-local/node_modules/@qunnovera/numfy" : "dist";

switch (cmd) {
  case "copy-assets":
    mkdirSync(outDir, { recursive: true });
    copyFileSync("package.json", join(outDir, "package.json"));
    copyFileSync("readme.md", join(outDir, "readme.md"));
    break;
  default:
    console.error(`Unknown command: ${cmd}`);
    process.exit(1);
}

