import * as fs from "fs";
import * as path from "path";

export async function getFixtures(fixturePath: string): Promise<string[]> {
  const fullPath = path.join(process.cwd(), fixturePath);
  const fileContent = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(fileContent);
}
