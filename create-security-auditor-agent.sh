#!/usr/bin/env bash
# =============================================================================
# Create the "Security Auditor" Anthropic Managed Agent (beta) + environment.
#
# Prereqs:
#   1. Install the Anthropic CLI:   brew install anthropics/tap/ant
#      (Linux/WSL: download the `ant` binary v1.10.0+ from the releases page)
#   2. Export your API key:         export ANTHROPIC_API_KEY="sk-ant-..."
#   3. Run:                         bash create-security-auditor-agent.sh
#
# Notes:
#   - Model: claude-opus-4-8 (latest Opus; the requested "claude-opus-4-6"
#     does not exist as a valid model id).
#   - Saves the created agent/environment ids to ./.security-auditor-agent.env
# =============================================================================
set -euo pipefail

if ! command -v ant >/dev/null 2>&1; then
  echo "ERROR: 'ant' CLI not found. Install with: brew install anthropics/tap/ant" >&2
  exit 1
fi
if [[ -z "${ANTHROPIC_API_KEY:-}" ]]; then
  echo "ERROR: ANTHROPIC_API_KEY is not set. Run: export ANTHROPIC_API_KEY=sk-ant-..." >&2
  exit 1
fi

read -r -d '' SYSTEM_PROMPT <<'PROMPT' || true
You are a senior security auditor with expertise in conducting thorough security assessments, compliance audits, and risk evaluations. Your focus spans vulnerability assessment, compliance validation, security controls evaluation, and risk management with emphasis on providing actionable findings and ensuring organizational security posture.

When conducting an audit: define scope clearly, assess controls thoroughly, identify vulnerabilities completely, validate compliance accurately, evaluate risks properly, collect evidence systematically, document findings comprehensively, and ensure recommendations are actionable.

Compliance frameworks: SOC 2 Type II, ISO 27001/27002, HIPAA, PCI DSS, GDPR, NIST frameworks, CIS benchmarks. Audit domains include access control, data security, infrastructure hardening, application security, incident response readiness, and third-party risk.

Classify findings as Critical, High, Medium, Low, or Observations. Prioritize risk-based approach, thorough documentation, and actionable remediation guidance. Maintain independence and objectivity throughout. Deliver executive summaries with risk scores, compliance status, business impact, and remediation roadmaps with timelines and success metrics.
PROMPT

echo "==> Creating agent 'Security Auditor'..."
AGENT_JSON="$(ant beta:agents create \
  --name 'Security Auditor' \
  --model '{id: claude-opus-4-8}' \
  --system "$SYSTEM_PROMPT" \
  --tool '{type: agent_toolset_20260401}')"
echo "$AGENT_JSON"
AGENT_ID="$(printf '%s' "$AGENT_JSON" | grep -oE '"id"[[:space:]]*:[[:space:]]*"[^"]+"' | head -1 | sed -E 's/.*"([^"]+)"$/\1/')"

echo "==> Creating cloud environment..."
ENV_JSON="$(ant beta:environments create \
  --name 'security-auditor-env' \
  --config '{type: cloud, networking: {type: unrestricted}}')"
echo "$ENV_JSON"
ENV_ID="$(printf '%s' "$ENV_JSON" | grep -oE '"id"[[:space:]]*:[[:space:]]*"[^"]+"' | head -1 | sed -E 's/.*"([^"]+)"$/\1/')"

{
  echo "SECURITY_AUDITOR_AGENT_ID=$AGENT_ID"
  echo "SECURITY_AUDITOR_ENV_ID=$ENV_ID"
} > .security-auditor-agent.env

echo
echo "==> Saved ids to .security-auditor-agent.env"
echo "    AGENT_ID=$AGENT_ID"
echo "    ENV_ID=$ENV_ID"
echo
echo "Start a session and kick off an audit with:"
cat <<EOF

  SESSION_JSON=\$(ant beta:sessions create --agent "$AGENT_ID" --environment-id "$ENV_ID")
  SESSION_ID=\$(printf '%s' "\$SESSION_JSON" | grep -oE '"id"[[:space:]]*:[[:space:]]*"[^"]+"' | head -1 | sed -E 's/.*"([^"]+)"\$/\1/')

  ant beta:sessions:events send --session-id "\$SESSION_ID" \\
    --event '{type: user.message, content: [{type: text, text: "Conduct a security audit of troandigital.net: review headers, the contact-form pipeline, .htaccess hardening, and the post-compromise hosting cleanup. Classify findings and give a remediation roadmap."}]}'
EOF
