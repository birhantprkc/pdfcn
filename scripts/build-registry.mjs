import { spawnSync } from "node:child_process";
import { mkdir, readFile, rm } from "node:fs/promises";
import { dirname, posix, resolve } from "node:path";

const PROJECT_DIRECTORY = process.cwd();
const REGISTRY_PATH = resolve(PROJECT_DIRECTORY, "registry.json");
const OUTPUT_DIRECTORY = resolve(PROJECT_DIRECTORY, "public/r");

const parseRegistry = async () => {
  const registry = JSON.parse(await readFile(REGISTRY_PATH, "utf-8"));
  if (!Array.isArray(registry.items)) {
    throw new TypeError("registry.json must contain an items array.");
  }
  return registry;
};

const prepareOutputDirectory = async (registry) => {
  await rm(OUTPUT_DIRECTORY, { force: true, recursive: true });
  await mkdir(OUTPUT_DIRECTORY, { recursive: true });

  for (const item of registry.items) {
    const itemName = posix.normalize(item.name);
    if (posix.isAbsolute(itemName) || itemName.startsWith("../")) {
      throw new Error(`Registry item name "${item.name}" is not safe.`);
    }
    await mkdir(dirname(resolve(OUTPUT_DIRECTORY, `${itemName}.json`)), {
      recursive: true,
    });
  }
};

const runShadcnBuild = () => {
  const result = spawnSync(
    "pnpm",
    ["exec", "shadcn", "build", "registry.json", "--output", "./public/r"],
    { cwd: PROJECT_DIRECTORY, stdio: "inherit" }
  );
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const main = async () => {
  const registry = await parseRegistry();
  await prepareOutputDirectory(registry);
  runShadcnBuild();
  console.log(`Built ${registry.items.length} registry items → public/r`);
};

try {
  await main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
