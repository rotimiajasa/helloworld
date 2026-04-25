import { getDb } from '../database.js';
import path from 'path';
import fs from 'fs';

interface SeedCisBenchmark {
  benchmark: string;
  section: string;
  title: string;
  description: string;
  rationale: string;
  audit_command: string;
  remediation_command: string;
  level: number;
}

export function seedCis(): number {
  const db = getDb();
  const seedPath = path.join(process.cwd(), 'data', 'seed', 'cis.json');
  const data: SeedCisBenchmark[] = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

  const insert = db.prepare(`
    INSERT INTO cis_benchmarks (benchmark, section, title, description, rationale, audit_command, remediation_command, level)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((items: SeedCisBenchmark[]) => {
    db.prepare('DELETE FROM cis_benchmarks').run();
    for (const item of items) {
      insert.run(
        item.benchmark,
        item.section,
        item.title,
        item.description,
        item.rationale,
        item.audit_command,
        item.remediation_command,
        item.level
      );
    }
  });

  insertMany(data);
  db.exec(`INSERT INTO cis_benchmarks_fts(cis_benchmarks_fts) VALUES('rebuild');`);
  return data.length;
}
