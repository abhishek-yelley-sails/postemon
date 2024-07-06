import fs from "node:fs/promises";

export async function readData() {
  const data = await fs.readFile('./db/db.json', 'utf8');
  return JSON.parse(data);
}

export async function writeData(data: any) {
  await fs.writeFile('./db/db.json', JSON.stringify(data));
}