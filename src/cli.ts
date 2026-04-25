#!/usr/bin/env node
import { Command } from 'commander';
import { runAgentStreaming } from './agent.js';
import { countSkills } from './skills/database.js';

const program = new Command();

program
  .name('cyberstrike')
  .description(
    'AI-powered penetration testing agent with lazy-loaded security skills\n' +
    'Sources: MITRE ATT&CK | Atomic Red Team | OWASP WSTG | NIST SP 800-53 | CIS Benchmarks'
  )
  .version('0.1.0');

program
  .argument('[query]', 'Security testing query or task')
  .option('-k, --api-key <key>', 'Anthropic API key (or set ANTHROPIC_API_KEY env var)')
  .option('-m, --model <model>', 'Claude model to use', 'claude-sonnet-4-6')
  .option('-v, --verbose', 'Show tool calls and debug info', false)
  .option('--no-stream', 'Disable streaming output')
  .action(async (query: string | undefined, opts: {
    apiKey?: string;
    model: string;
    verbose: boolean;
    stream: boolean;
  }) => {
    if (!query) {
      printBanner();
      program.help();
      return;
    }

    try {
      await runAgentStreaming({
        query,
        apiKey: opts.apiKey,
        model: opts.model,
        verbose: opts.verbose,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      process.stderr.write(`Error: ${msg}\n`);
      process.exit(1);
    }
  });

program
  .command('stats')
  .description('Show number of loaded skills per source')
  .action(() => {
    try {
      const counts = countSkills();
      printBanner();
      console.log('\nLoaded Skills:');
      console.log(`  MITRE ATT&CK Techniques : ${counts.techniques}`);
      console.log(`  Atomic Red Team Tests   : ${counts.atomic_tests}`);
      console.log(`  OWASP WSTG Procedures   : ${counts.web_tests}`);
      console.log(`  NIST SP 800-53 Controls : ${counts.nist_controls}`);
      console.log(`  CIS Benchmark Checks    : ${counts.cis_benchmarks}`);
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      console.log(`  ─────────────────────────`);
      console.log(`  Total Skills            : ${total}`);
      console.log('');
    } catch {
      console.log('Database not seeded yet. Run: npm run seed');
    }
  });

program
  .command('seed')
  .description('Seed the database with bundled skill data')
  .action(async () => {
    const { seedMitreAttack } = await import('./skills/sources/mitre-attack.js');
    const { seedAtomicRedTeam } = await import('./skills/sources/atomic-red-team.js');
    const { seedOwaspWstg } = await import('./skills/sources/owasp-wstg.js');
    const { seedNist } = await import('./skills/sources/nist.js');
    const { seedCis } = await import('./skills/sources/cis.js');

    console.log('Seeding skill database...');
    console.log(`  MITRE ATT&CK     : ${seedMitreAttack()} techniques`);
    console.log(`  Atomic Red Team  : ${seedAtomicRedTeam()} tests`);
    console.log(`  OWASP WSTG       : ${seedOwaspWstg()} procedures`);
    console.log(`  NIST SP 800-53   : ${seedNist()} controls`);
    console.log(`  CIS Benchmarks   : ${seedCis()} checks`);
    console.log('Done. Run: cyberstrike "your security query"');
  });

function printBanner(): void {
  console.log(`
  ██████╗██╗   ██╗██████╗ ███████╗██████╗ ███████╗████████╗██████╗ ██╗██╗  ██╗███████╗
 ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██║██║ ██╔╝██╔════╝
 ██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝███████╗   ██║   ██████╔╝██║█████╔╝ █████╗
 ██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗╚════██║   ██║   ██╔══██╗██║██╔═██╗ ██╔══╝
 ╚██████╗   ██║   ██████╔╝███████╗██║  ██║███████║   ██║   ██║  ██║██║██║  ██╗███████╗
  ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝

  AI-Powered Pentesting Agent | 7,300+ Offensive Security Skills | AGPL-3.0
  Sources: MITRE ATT&CK · Atomic Red Team · OWASP WSTG · NIST · CIS Benchmarks
  `);
}

program.parse();
