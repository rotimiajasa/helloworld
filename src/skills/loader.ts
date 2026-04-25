import {
  searchTechniques,
  getAtomicTests,
  searchWebTests,
  getNistControls,
  getCisBenchmarks,
  Technique,
  AtomicTest,
  WebTest,
  NistControl,
  CisBenchmark,
} from './database.js';

export interface ToolInput {
  [key: string]: unknown;
}

export function executeTool(toolName: string, input: ToolInput): string {
  switch (toolName) {
    case 'search_techniques':
      return handleSearchTechniques(input);
    case 'get_atomic_tests':
      return handleGetAtomicTests(input);
    case 'search_web_tests':
      return handleSearchWebTests(input);
    case 'get_nist_controls':
      return handleGetNistControls(input);
    case 'get_cis_benchmarks':
      return handleGetCisBenchmarks(input);
    default:
      return JSON.stringify({ error: `Unknown tool: ${toolName}` });
  }
}

function handleSearchTechniques(input: ToolInput): string {
  const query = String(input.query ?? '');
  const tactic = input.tactic ? String(input.tactic) : undefined;
  const platform = input.platform ? String(input.platform) : undefined;
  const limit = typeof input.limit === 'number' ? input.limit : 10;

  const results = searchTechniques(query, tactic, platform, limit);

  if (results.length === 0) {
    return JSON.stringify({ message: 'No techniques found matching the query.', results: [] });
  }

  return JSON.stringify({
    count: results.length,
    techniques: results.map(formatTechnique),
  });
}

function handleGetAtomicTests(input: ToolInput): string {
  const techniqueId = String(input.technique_id ?? '');
  const platform = input.platform ? String(input.platform) : undefined;

  const results = getAtomicTests(techniqueId, platform);

  if (results.length === 0) {
    return JSON.stringify({
      message: `No Atomic Red Team tests found for technique ${techniqueId}.`,
      results: [],
    });
  }

  return JSON.stringify({
    technique_id: techniqueId,
    count: results.length,
    tests: results.map(formatAtomicTest),
  });
}

function handleSearchWebTests(input: ToolInput): string {
  const query = String(input.query ?? '');
  const category = input.category ? String(input.category) : undefined;

  const results = searchWebTests(query, category);

  if (results.length === 0) {
    return JSON.stringify({ message: 'No OWASP WSTG tests found matching the query.', results: [] });
  }

  return JSON.stringify({
    count: results.length,
    tests: results.map(formatWebTest),
  });
}

function handleGetNistControls(input: ToolInput): string {
  const query = String(input.query ?? '');
  const baseline = input.baseline ? String(input.baseline) : undefined;

  const results = getNistControls(query, baseline);

  if (results.length === 0) {
    return JSON.stringify({ message: 'No NIST controls found matching the query.', results: [] });
  }

  return JSON.stringify({
    count: results.length,
    controls: results.map(formatNistControl),
  });
}

function handleGetCisBenchmarks(input: ToolInput): string {
  const benchmark = String(input.benchmark ?? '');
  const query = input.query ? String(input.query) : undefined;
  const level = typeof input.level === 'number' ? input.level : undefined;

  const results = getCisBenchmarks(benchmark, query, level);

  if (results.length === 0) {
    return JSON.stringify({
      message: `No CIS benchmark checks found for "${benchmark}".`,
      results: [],
    });
  }

  return JSON.stringify({
    benchmark,
    count: results.length,
    checks: results.map(formatCisBenchmark),
  });
}

function formatTechnique(t: Technique) {
  return {
    id: t.id,
    name: t.name,
    tactic: t.tactic,
    platforms: t.platforms,
    description: t.description,
    detection: t.detection,
    mitigation: t.mitigation,
  };
}

function formatAtomicTest(t: AtomicTest) {
  return {
    name: t.name,
    description: t.description,
    platforms: t.platforms,
    executor: t.executor,
    command: t.command,
    cleanup: t.cleanup_command || null,
    dependencies: t.dependencies,
  };
}

function formatWebTest(t: WebTest) {
  return {
    id: t.id,
    category: t.category,
    name: t.name,
    description: t.description,
    objectives: t.objectives,
    test_cases: t.test_cases,
    tools: t.tools,
    remediation: t.remediation,
  };
}

function formatNistControl(c: NistControl) {
  return {
    id: c.id,
    family: c.family,
    name: c.name,
    description: c.description,
    guidance: c.guidance,
    baseline: c.baseline,
  };
}

function formatCisBenchmark(b: CisBenchmark) {
  return {
    section: b.section,
    title: b.title,
    description: b.description,
    rationale: b.rationale,
    level: b.level,
    audit: b.audit_command,
    remediation: b.remediation_command,
  };
}
