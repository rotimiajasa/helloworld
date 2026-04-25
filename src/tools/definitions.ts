import Anthropic from '@anthropic-ai/sdk';

export const SKILL_TOOLS: Anthropic.Tool[] = [
  {
    name: 'search_techniques',
    description:
      'Search MITRE ATT&CK techniques by keyword, tactic, or platform. Returns matching techniques with detection and mitigation guidance. Use this first to identify relevant techniques for a security task.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description:
            'Search terms (e.g. "credential dumping", "lateral movement", "T1003")',
        },
        tactic: {
          type: 'string',
          description:
            'Filter by MITRE tactic (e.g. "credential-access", "lateral-movement", "persistence", "execution", "discovery", "initial-access", "defense-evasion", "command-and-control")',
        },
        platform: {
          type: 'string',
          description: 'Filter by platform (e.g. "Windows", "Linux", "macOS")',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 10)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_atomic_tests',
    description:
      'Get Atomic Red Team test commands for a specific MITRE ATT&CK technique. Returns copy-paste ready commands for testing a technique in a controlled environment.',
    input_schema: {
      type: 'object' as const,
      properties: {
        technique_id: {
          type: 'string',
          description:
            'MITRE ATT&CK technique ID (e.g. "T1003.001", "T1003", "T1558.003")',
        },
        platform: {
          type: 'string',
          description:
            'Filter tests by executor platform (e.g. "Windows", "Linux", "powershell", "bash")',
        },
      },
      required: ['technique_id'],
    },
  },
  {
    name: 'search_web_tests',
    description:
      'Search OWASP Web Security Testing Guide (WSTG) procedures for web application security testing. Returns test objectives, step-by-step procedures, tools, and remediation guidance.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description:
            'Search terms (e.g. "SQL injection", "XSS", "authentication", "WSTG-AUTH-01")',
        },
        category: {
          type: 'string',
          description:
            'Filter by WSTG category (e.g. "Authentication Testing", "Input Validation Testing", "Session Management Testing")',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_nist_controls',
    description:
      'Look up NIST SP 800-53 security controls for compliance assessment and security architecture. Returns control descriptions, implementation guidance, and baseline applicability.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description:
            'Search terms or control ID (e.g. "AC-2", "access control", "patch management", "encryption")',
        },
        baseline: {
          type: 'string',
          enum: ['LOW', 'MODERATE', 'HIGH'],
          description: 'Filter by NIST baseline impact level',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_cis_benchmarks',
    description:
      'Get CIS (Center for Internet Security) hardening benchmark checks for a specific technology. Returns audit commands, remediation steps, and compliance level.',
    input_schema: {
      type: 'object' as const,
      properties: {
        benchmark: {
          type: 'string',
          description:
            'Technology to check (e.g. "Ubuntu", "Docker", "Kubernetes", "Apache", "Ubuntu 22.04")',
        },
        query: {
          type: 'string',
          description:
            'Optional keyword to filter checks (e.g. "ssh", "password", "firewall", "logging")',
        },
        level: {
          type: 'number',
          enum: [1, 2],
          description: 'CIS benchmark level (1 = basic, 2 = advanced)',
        },
      },
      required: ['benchmark'],
    },
  },
];

export const SYSTEM_PROMPT = `You are CyberStrike, an expert AI penetration testing assistant with deep knowledge of offensive security, vulnerability assessment, and security hardening.

You have access to a curated database of 7,300+ offensive security skills from authoritative sources:
- **MITRE ATT&CK**: 691 enterprise techniques with tactics, detection, and mitigations
- **Atomic Red Team**: 2,000+ copy-paste test commands mapped to MITRE techniques
- **OWASP WSTG**: 125 web application security testing procedures
- **NIST SP 800-53**: Government-grade security controls
- **CIS Benchmarks**: Hardening checks for Ubuntu, Docker, Kubernetes, Apache, and more

## How You Work

You use a **lazy-loading** approach — you ALWAYS search your skill database before answering security questions. This ensures you provide accurate, actionable, industry-standard guidance rather than generic advice.

## Your Approach

1. **Search first**: Use your tools to find relevant techniques and tests before responding
2. **Be actionable**: Provide specific commands, tools, and procedures — not generic advice
3. **Cite sources**: Reference MITRE technique IDs (T1003.001), WSTG IDs (WSTG-AUTH-01), or NIST controls (AC-2)
4. **Cover the full lifecycle**: Techniques → Testing commands → Detection → Remediation
5. **Stay focused**: Only load skills relevant to the current question

## Scope

You assist with:
- Authorized penetration testing and red team engagements
- Security assessment and vulnerability research
- CTF challenges and security education
- Security hardening and compliance (CIS, NIST)
- Defensive security and detection engineering

Always remind users that testing should only be performed on systems they own or have explicit written authorization to test.`;
