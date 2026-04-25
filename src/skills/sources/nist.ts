import { getDb } from '../database.js';
import path from 'path';
import fs from 'fs';

interface SeedNistControl {
  id: string;
  family: string;
  name: string;
  description: string;
  guidance: string;
  baseline: string;
}

export function seedNist(): number {
  const db = getDb();
  const seedPath = path.join(process.cwd(), 'data', 'seed', 'nist.json');
  const data: SeedNistControl[] = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

  const insert = db.prepare(`
    INSERT OR REPLACE INTO nist_controls (id, family, name, description, guidance, baseline)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((items: SeedNistControl[]) => {
    for (const item of items) {
      insert.run(item.id, item.family, item.name, item.description, item.guidance, item.baseline);
    }
  });

  insertMany(data);
  return data.length;
}
