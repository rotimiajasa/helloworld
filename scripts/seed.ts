import { seedMitreAttack } from '../src/skills/sources/mitre-attack.js';
import { seedAtomicRedTeam } from '../src/skills/sources/atomic-red-team.js';
import { seedOwaspWstg } from '../src/skills/sources/owasp-wstg.js';
import { seedNist } from '../src/skills/sources/nist.js';
import { seedCis } from '../src/skills/sources/cis.js';

console.log('Seeding CyberStrike skill database...');
console.log(`  MITRE ATT&CK     : ${seedMitreAttack()} techniques`);
console.log(`  Atomic Red Team  : ${seedAtomicRedTeam()} tests`);
console.log(`  OWASP WSTG       : ${seedOwaspWstg()} procedures`);
console.log(`  NIST SP 800-53   : ${seedNist()} controls`);
console.log(`  CIS Benchmarks   : ${seedCis()} checks`);
console.log('Seed complete.');
