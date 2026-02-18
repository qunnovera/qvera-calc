import { execSync } from "child_process";
import { resolve } from "path";

execSync("npm publish", {
  cwd: resolve("dist"),
  stdio: "inherit",
});