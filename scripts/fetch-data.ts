/**
 * Fetches full datasets from upstream authoritative sources.
 * Run after `npm run build`: node dist/scripts/fetch-data.js
 *
 * Sources:
 *   - Atomic Red Team: https://github.com/redcanaryco/atomic-red-team
 *   - MITRE ATT&CK: https://github.com/mitre/cti (STIX JSON)
 *   - OWASP WSTG: https://github.com/OWASP/wstg
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { getDb } from '../src/skills/database.js';

const SEED_DIR = path.join(process.cwd(), 'data', 'seed');

async function fetchJson(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'cyberstrike/0.1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        fetchJson(res.headers.location!).then(resolve).catch(reject);
        return;
      }
      let data = '';
      res.on('data', (chunk: Buffer) => (data += chunk.toString()));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error(`Failed to parse JSON from ${url}`));
        }
      });
    });
    req.on('error', reject);
  });
}

async function fetchMitreAttack(): Promise<void> {
  console.log('Fetching MITRE ATT&CK enterprise techniques...');
  const url =
    'https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json';

  const bundle = (await fetchJson(url)) as {
    objects: Array<{
      type: string;
      id: string;
      name: string;
      external_references?: Array<{ source_name: string; external_id?: string }>;
      kill_chain_phases?: Array<{ phase_name: string }>;
      description?: string;
      x_mitre_platforms?: string[];
      x_mitre_detection?: string;
      x_mitre_is_subtechnique?: boolean;
    }>;
  };

  const techniques = bundle.objects
    .filter((o) => o.type === 'attack-pattern')
    .map((o) => {
      const extRef = o.external_references?.find((r) => r.source_name === 'mitre-attack');
      return {
        id: extRef?.external_id ?? '',
        name: o.name,
        tactic: o.kill_chain_phases?.[0]?.phase_name ?? '',
        description: o.description ?? '',
        platforms: o.x_mitre_platforms ?? [],
        detection: o.x_mitre_detection ?? '',
        mitigation: '',
        source: 'mitre-attack',
      };
    })
    .filter((t) => t.id.startsWith('T'));

  fs.writeFileSync(path.join(SEED_DIR, 'mitre-attack.json'), JSON.stringify(techniques, null, 2));
  console.log(`  Saved ${techniques.length} MITRE ATT&CK techniques.`);

  const db = getDb();
  const insert = db.prepare(`
    INSERT OR REPLACE INTO techniques (id, name, tactic, description, platforms, detection, mitigation, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertMany = db.transaction(
    (items: typeof techniques) => {
      for (const item of items) {
        insert.run(item.id, item.name, item.tactic, item.description,
          JSON.stringify(item.platforms), item.detection, item.mitigation, item.source);
      }
    }
  );
  insertMany(techniques);
  db.exec(`INSERT INTO techniques_fts(techniques_fts) VALUES('rebuild');`);
  console.log(`  Inserted ${techniques.length} techniques into database.`);
}

async function fetchAtomicRedTeam(): Promise<void> {
  console.log('Fetching Atomic Red Team index...');
  const indexUrl =
    'https://raw.githubusercontent.com/redcanaryco/atomic-red-team/master/atomics/Indexes/index.yaml';

  console.log(`  Index URL: ${indexUrl}`);
  console.log('  Note: Full Atomic Red Team YAML parsing requires a YAML parser.');
  console.log('  Install js-yaml and extend this function for full dataset.');
  console.log('  For now, the seed data bundled in data/seed/atomic-red-team.json is used.');
}

async function main(): Promise<void> {
  console.log('CyberStrike Data Fetcher\n');
  console.log('This script downloads full datasets from upstream authoritative sources.');
  console.log('Ensure you have network access before running.\n');

  const args = process.argv.slice(2);
  const fetchAll = args.length === 0 || args.includes('--all');

  if (fetchAll || args.includes('--mitre')) {
    await fetchMitreAttack().catch((e) =>
      console.error('  MITRE ATT&CK fetch failed:', (e as Error).message)
    );
  }

  if (fetchAll || args.includes('--atomic')) {
    await fetchAtomicRedTeam().catch((e) =>
      console.error('  Atomic Red Team fetch failed:', (e as Error).message)
    );
  }

  console.log('\nFetch complete. Run: cyberstrike stats');
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
