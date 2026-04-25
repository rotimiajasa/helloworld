import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'data', 'db');
const DB_PATH = path.join(DB_DIR, 'skills.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  fs.mkdirSync(DB_DIR, { recursive: true });
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  initSchema(db);
  return db;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS techniques (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tactic TEXT,
      description TEXT,
      platforms TEXT,
      detection TEXT,
      mitigation TEXT,
      source TEXT DEFAULT 'mitre-attack'
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS techniques_fts USING fts5(
      id, name, description, tactic, platforms,
      content=techniques, content_rowid=rowid
    );

    CREATE TABLE IF NOT EXISTS atomic_tests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      technique_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      platforms TEXT,
      executor TEXT,
      command TEXT,
      cleanup_command TEXT,
      dependencies TEXT
    );

    CREATE TABLE IF NOT EXISTS web_tests (
      id TEXT PRIMARY KEY,
      category TEXT,
      name TEXT NOT NULL,
      description TEXT,
      objectives TEXT,
      test_cases TEXT,
      tools TEXT,
      remediation TEXT
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS web_tests_fts USING fts5(
      id, name, description, category,
      content=web_tests, content_rowid=rowid
    );

    CREATE TABLE IF NOT EXISTS nist_controls (
      id TEXT PRIMARY KEY,
      family TEXT,
      name TEXT NOT NULL,
      description TEXT,
      guidance TEXT,
      baseline TEXT
    );

    CREATE TABLE IF NOT EXISTS cis_benchmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      benchmark TEXT NOT NULL,
      section TEXT,
      title TEXT NOT NULL,
      description TEXT,
      rationale TEXT,
      audit_command TEXT,
      remediation_command TEXT,
      level INTEGER
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS cis_benchmarks_fts USING fts5(
      benchmark, title, description, audit_command,
      content=cis_benchmarks, content_rowid=rowid
    );
  `);
}

export interface Technique {
  id: string;
  name: string;
  tactic: string;
  description: string;
  platforms: string[];
  detection: string;
  mitigation: string;
}

export interface AtomicTest {
  id: number;
  technique_id: string;
  name: string;
  description: string;
  platforms: string[];
  executor: string;
  command: string;
  cleanup_command: string;
  dependencies: string[];
}

export interface WebTest {
  id: string;
  category: string;
  name: string;
  description: string;
  objectives: string[];
  test_cases: string[];
  tools: string[];
  remediation: string;
}

export interface NistControl {
  id: string;
  family: string;
  name: string;
  description: string;
  guidance: string;
  baseline: string;
}

export interface CisBenchmark {
  id: number;
  benchmark: string;
  section: string;
  title: string;
  description: string;
  rationale: string;
  audit_command: string;
  remediation_command: string;
  level: number;
}

export function searchTechniques(
  query: string,
  tactic?: string,
  platform?: string,
  limit = 10
): Technique[] {
  const db = getDb();
  let sql: string;
  const params: (string | number)[] = [];

  if (query.match(/^T\d{4}(\.\d{3})?$/i)) {
    sql = `SELECT * FROM techniques WHERE id LIKE ? LIMIT ?`;
    params.push(`${query.toUpperCase()}%`, limit);
  } else {
    sql = `
      SELECT t.* FROM techniques t
      JOIN techniques_fts fts ON t.rowid = fts.rowid
      WHERE techniques_fts MATCH ?
    `;
    params.push(query.replace(/['"*]/g, ' ').trim() + '*');

    if (tactic) {
      sql += ` AND t.tactic LIKE ?`;
      params.push(`%${tactic}%`);
    }
    if (platform) {
      sql += ` AND t.platforms LIKE ?`;
      params.push(`%${platform}%`);
    }
    sql += ` LIMIT ?`;
    params.push(limit);
  }

  const rows = db.prepare(sql).all(...params) as Record<string, unknown>[];
  return rows.map(deserializeTechnique);
}

export function getAtomicTests(techniqueId: string, platform?: string): AtomicTest[] {
  const db = getDb();
  let sql = `SELECT * FROM atomic_tests WHERE technique_id LIKE ?`;
  const params: (string | number)[] = [`${techniqueId.toUpperCase()}%`];

  if (platform) {
    sql += ` AND platforms LIKE ?`;
    params.push(`%${platform}%`);
  }

  const rows = db.prepare(sql).all(...params) as Record<string, unknown>[];
  return rows.map(deserializeAtomicTest);
}

export function searchWebTests(query: string, category?: string, limit = 10): WebTest[] {
  const db = getDb();
  let sql: string;
  const params: (string | number)[] = [];

  if (query.match(/^WSTG-/i)) {
    sql = `SELECT * FROM web_tests WHERE id LIKE ? LIMIT ?`;
    params.push(`${query.toUpperCase()}%`, limit);
  } else {
    sql = `
      SELECT w.* FROM web_tests w
      JOIN web_tests_fts fts ON w.rowid = fts.rowid
      WHERE web_tests_fts MATCH ?
    `;
    params.push(query.replace(/['"*]/g, ' ').trim() + '*');

    if (category) {
      sql += ` AND w.category LIKE ?`;
      params.push(`%${category}%`);
    }
    sql += ` LIMIT ?`;
    params.push(limit);
  }

  const rows = db.prepare(sql).all(...params) as Record<string, unknown>[];
  return rows.map(deserializeWebTest);
}

export function getNistControls(query: string, baseline?: string, limit = 10): NistControl[] {
  const db = getDb();
  let sql: string;
  const params: (string | number)[] = [];

  if (query.match(/^[A-Z]{2,3}-\d+/i)) {
    sql = `SELECT * FROM nist_controls WHERE id LIKE ? LIMIT ?`;
    params.push(`${query.toUpperCase()}%`, limit);
  } else {
    sql = `SELECT * FROM nist_controls WHERE name LIKE ? OR description LIKE ? OR family LIKE ?`;
    const like = `%${query}%`;
    params.push(like, like, like);

    if (baseline) {
      sql += ` AND baseline = ?`;
      params.push(baseline.toUpperCase());
    }
    sql += ` LIMIT ?`;
    params.push(limit);
  }

  return db.prepare(sql).all(...params) as NistControl[];
}

export function getCisBenchmarks(
  benchmark: string,
  query?: string,
  level?: number,
  limit = 15
): CisBenchmark[] {
  const db = getDb();
  let sql: string;
  const params: (string | number)[] = [];

  if (query) {
    sql = `
      SELECT c.* FROM cis_benchmarks c
      JOIN cis_benchmarks_fts fts ON c.rowid = fts.rowid
      WHERE cis_benchmarks_fts MATCH ?
      AND c.benchmark LIKE ?
    `;
    params.push(query.replace(/['"*]/g, ' ').trim() + '*', `%${benchmark}%`);
  } else {
    sql = `SELECT * FROM cis_benchmarks WHERE benchmark LIKE ?`;
    params.push(`%${benchmark}%`);
  }

  if (level) {
    sql += ` AND level = ?`;
    params.push(level);
  }
  sql += ` LIMIT ?`;
  params.push(limit);

  return db.prepare(sql).all(...params) as CisBenchmark[];
}

function deserializeTechnique(row: Record<string, unknown>): Technique {
  return ({
    ...row,
    platforms: parseJson(row.platforms as string, []),
  } as unknown) as Technique;
}

function deserializeAtomicTest(row: Record<string, unknown>): AtomicTest {
  return ({
    ...row,
    platforms: parseJson(row.platforms as string, []),
    dependencies: parseJson(row.dependencies as string, []),
  } as unknown) as AtomicTest;
}

function deserializeWebTest(row: Record<string, unknown>): WebTest {
  return ({
    ...row,
    objectives: parseJson(row.objectives as string, []),
    test_cases: parseJson(row.test_cases as string, []),
    tools: parseJson(row.tools as string, []),
  } as unknown) as WebTest;
}

function parseJson<T>(val: string | null | undefined, fallback: T): T {
  if (!val) return fallback;
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

export function countSkills(): Record<string, number> {
  const db = getDb();
  return {
    techniques: (db.prepare('SELECT COUNT(*) as c FROM techniques').get() as { c: number }).c,
    atomic_tests: (db.prepare('SELECT COUNT(*) as c FROM atomic_tests').get() as { c: number }).c,
    web_tests: (db.prepare('SELECT COUNT(*) as c FROM web_tests').get() as { c: number }).c,
    nist_controls: (db.prepare('SELECT COUNT(*) as c FROM nist_controls').get() as { c: number }).c,
    cis_benchmarks: (db.prepare('SELECT COUNT(*) as c FROM cis_benchmarks').get() as { c: number }).c,
  };
}
