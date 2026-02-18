import { rmSync } from "fs";

const folders = ["dist", "npm-local"];

for (const f of folders) {
  rmSync(f, { recursive: true, force: true });
}

