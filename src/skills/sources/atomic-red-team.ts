import { getDb } from '../database.js';
import path from 'path';
import fs from 'fs';

interface SeedAtomicTest {
  technique_id: string;
  name: string;
  description: string;
  platforms: string[];
  executor: string;
  command: string;
  cleanup_command: string;
  dependencies: string[];
}

export function seedAtomicRedTeam(): number {
  const db = getDb();
  const seedPath = path.join(process.cwd(), 'data', 'seed', 'atomic-red-team.json');
  const data: SeedAtomicTest[] = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

  const insert = db.prepare(`
    INSERT INTO atomic_tests (technique_id, name, description, platforms, executor, command, cleanup_command, dependencies)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((items: SeedAtomicTest[]) => {
    db.prepare('DELETE FROM atomic_tests').run();
    for (const item of items) {
      insert.run(
        item.technique_id,
        item.name,
        item.description,
        JSON.stringify(item.platforms),
        item.executor,
        item.command,
        item.cleanup_command ?? '',
        JSON.stringify(item.dependencies ?? [])
      );
    }
  });

  insertMany(data);
  return data.length;
}
