import { getDb } from '../database.js';
import path from 'path';
import fs from 'fs';

interface SeedWebTest {
  id: string;
  category: string;
  name: string;
  description: string;
  objectives: string[];
  test_cases: string[];
  tools: string[];
  remediation: string;
}

export function seedOwaspWstg(): number {
  const db = getDb();
  const seedPath = path.join(process.cwd(), 'data', 'seed', 'owasp-wstg.json');
  const data: SeedWebTest[] = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

  const insert = db.prepare(`
    INSERT OR REPLACE INTO web_tests (id, category, name, description, objectives, test_cases, tools, remediation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((items: SeedWebTest[]) => {
    for (const item of items) {
      insert.run(
        item.id,
        item.category,
        item.name,
        item.description,
        JSON.stringify(item.objectives),
        JSON.stringify(item.test_cases),
        JSON.stringify(item.tools),
        item.remediation
      );
    }
  });

  insertMany(data);
  db.exec(`INSERT INTO web_tests_fts(web_tests_fts) VALUES('rebuild');`);
  return data.length;
}
