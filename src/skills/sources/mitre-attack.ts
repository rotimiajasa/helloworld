import { getDb } from '../database.js';
import path from 'path';
import fs from 'fs';

interface SeedTechnique {
  id: string;
  name: string;
  tactic: string;
  description: string;
  platforms: string[];
  detection: string;
  mitigation: string;
  source?: string;
}

export function seedMitreAttack(): number {
  const db = getDb();
  const seedPath = path.join(process.cwd(), 'data', 'seed', 'mitre-attack.json');
  const data: SeedTechnique[] = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

  const insert = db.prepare(`
    INSERT OR REPLACE INTO techniques (id, name, tactic, description, platforms, detection, mitigation, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((items: SeedTechnique[]) => {
    for (const item of items) {
      insert.run(
        item.id,
        item.name,
        item.tactic,
        item.description,
        JSON.stringify(item.platforms),
        item.detection,
        item.mitigation,
        item.source ?? 'mitre-attack'
      );
    }
  });

  insertMany(data);
  rebuildFts(db);
  return data.length;
}

function rebuildFts(db: ReturnType<typeof getDb>): void {
  db.exec(`
    INSERT INTO techniques_fts(techniques_fts) VALUES('rebuild');
  `);
}
