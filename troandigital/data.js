/* Troan Digital — site content */
window.TROAN = {
  stats: [
    { value: 200,    suffix: '+',  label: 'Organisations protected' },
    { value: 50000,  suffix: '+',  label: 'Threats neutralised' },
    { value: 24,     suffix: '/7', label: 'SOC monitoring' },
    { value: 15,     prefix: '<', suffix: 'm', label: 'Mean response time' },
  ],

  services: [
    {
      icon: 'shield',
      color: 'cyan',
      badge: 'Core',
      title: '24/7 SOC Monitoring',
      desc: 'Our Security Operations Centre watches your entire estate continuously — correlating signals, hunting anomalies and escalating real threats in minutes.',
      tags: ['SIEM/SOAR', 'Log Management', 'Threat Intel'],
    },
    {
      icon: 'radar',
      color: 'purple',
      badge: 'Popular',
      title: 'Managed Detection & Response',
      desc: 'Advanced endpoint and network telemetry combined with expert-led threat hunting and automated containment to stop adversaries fast.',
      tags: ['EDR / XDR', 'Threat Hunting', 'Auto-Containment'],
    },
    {
      icon: 'bug',
      color: 'amber',
      title: 'Penetration Testing',
      desc: 'Certified ethical hackers simulate real-world attacks against your apps, networks and people — then hand you a prioritised remediation roadmap.',
      tags: ['Network', 'Web & Mobile', 'Social Eng.'],
    },
    {
      icon: 'check',
      color: 'green',
      title: 'Compliance & Risk',
      desc: 'Achieve and maintain ISO 27001, PCI-DSS, NDPR, GDPR and the CBN framework — with policies, evidence and audit support handled for you.',
      tags: ['ISO 27001', 'PCI-DSS', 'NDPR'],
    },
    {
      icon: 'cloud',
      color: 'sky',
      title: 'Cloud Security',
      desc: 'We assess, harden and continuously monitor your AWS, Azure or GCP environment so misconfigurations never become your next breach.',
      tags: ['CSPM', 'IAM', 'Kubernetes'],
    },
    {
      icon: 'lock',
      color: 'rose',
      title: 'Endpoint Protection',
      desc: 'Next-gen antivirus, device control, patching and zero-trust access deployed and managed across every device in your workforce.',
      tags: ['NGAV', 'DLP', 'ZTNA'],
    },
  ],

  steps: [
    { n: '01', title: 'Assess', desc: 'A free security assessment maps your assets, exposure and current gaps.' },
    { n: '02', title: 'Deploy', desc: 'We install sensors, integrate log sources and baseline your environment in days.' },
    { n: '03', title: 'Monitor', desc: 'Your dedicated SOC team goes live — watching, hunting and triaging 24/7.' },
    { n: '04', title: 'Respond', desc: 'Threats are contained in minutes, with clear reports and continuous tuning.' },
  ],

  plans: [
    {
      name: 'Essentials',
      price: '₦350k',
      period: '/month',
      tagline: 'For SMEs getting started with managed security.',
      highlight: false,
      cta: 'Get Started',
      features: [
        '24/7 SOC monitoring · up to 50 assets',
        'SIEM log management · 30-day retention',
        'Monthly vulnerability scan',
        'Email & phone incident support',
        'Monthly security report',
        'NDPR compliance baseline',
      ],
    },
    {
      name: 'Professional',
      price: '₦850k',
      period: '/month',
      tagline: 'Full MDR for growing organisations.',
      highlight: true,
      badge: 'Most Popular',
      cta: 'Start Free Trial',
      features: [
        'Everything in Essentials',
        'MDR with EDR on all endpoints',
        'Quarterly penetration test',
        '90-day log retention',
        'Dedicated security analyst',
        'ISO 27001 / PCI-DSS readiness',
        '< 15 min response SLA',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      tagline: 'Tailored for large & regulated businesses.',
      highlight: false,
      cta: 'Contact Sales',
      features: [
        'Everything in Professional',
        'Cloud security (CSPM)',
        'Red team & social engineering',
        '1-year log retention',
        'vCISO advisory service',
        'Regulatory liaison (CBN, NDPC)',
        'On-site incident response',
      ],
    },
  ],

  team: [
    { name: 'Rotimi Ajasa',  role: 'CEO & Founder',          certs: ['CISSP', 'CISM'] },
    { name: 'Ngozi Adeyemi', role: 'Head of SOC Operations', certs: ['OSCP', 'CEH'] },
    { name: 'Chidi Okafor',  role: 'Head of Compliance',     certs: ['CISA', 'ISO 27001 LA'] },
    { name: 'Taiwo Bankole', role: 'Lead Penetration Tester', certs: ['OSCP', 'PNPT'] },
  ],

  certs: ['ISO 27001 Certified', 'PCI-DSS QSA Partner', 'Microsoft Security Partner', 'AWS Security Competency', 'NDPC Accredited'],

  testimonials: [
    {
      quote: 'Troan Digital detected and contained a ransomware attempt within 12 minutes of initial compromise. We never lost a single minute of downtime. Their SOC is genuinely world-class.',
      name: 'Emeka Okonkwo', role: 'CTO, Finbridge Payments', loc: 'Lagos, Nigeria',
    },
    {
      quote: 'We achieved ISO 27001 certification in 9 months with Troan\'s compliance team guiding every step. They made what felt impossible completely manageable.',
      name: 'Amaka Eze', role: 'CISO, Heritage Microfinance Bank', loc: 'Abuja, Nigeria',
    },
    {
      quote: 'Our board mandated enterprise-grade security in 60 days after a competitor was breached. Troan delivered the full MDR stack on time, under budget, zero disruption.',
      name: 'David Mensah', role: 'Head of IT, Accra Logistics Group', loc: 'Accra, Ghana',
    },
  ],

  insights: [
    {
      cat: 'Compliance', hue: 'cyan', read: '8 min', date: 'May 14, 2026',
      title: 'NDPR 2025 Amendments: what Nigerian businesses must do now',
      excerpt: 'The NDPC has issued new enforcement guidance. Here is what changed, who is affected and the three actions to take before Q3.',
    },
    {
      cat: 'Threat Intel', hue: 'rose', read: '12 min', date: 'Apr 28, 2026',
      title: 'Ransomware targeting West African finance: 2026 report',
      excerpt: 'Our SOC tracked 23 ransomware campaigns against Nigerian banks and fintechs in Q1. Here are the TTPs, the entry points, and how to close them.',
    },
    {
      cat: 'Strategy', hue: 'purple', read: '10 min', date: 'Apr 12, 2026',
      title: 'Zero Trust is not just for enterprises — an SME playbook',
      excerpt: 'You don\'t need a $10M budget to adopt Zero Trust. A practical, step-by-step guide for organisations of 20–200 people.',
    },
  ],

  faqs: [
    { q: 'How quickly can you onboard my organisation?', a: 'Standard onboarding takes 5–10 business days. We deploy sensors, integrate log sources, baseline your environment and have SOC coverage live before the end of the first week.' },
    { q: 'Do you only serve Nigerian businesses?', a: 'No — we serve clients across West Africa (Ghana, Kenya, South Africa) as well as diaspora businesses in the UK and Europe with African operations.' },
    { q: 'What happens when an incident is detected?', a: 'A SOC analyst validates the alert, escalates to a senior analyst if confirmed, and contacts your incident response lead. Containment actions can be executed with or without prior approval, depending on your agreed playbook.' },
    { q: 'Can you work alongside our existing IT team?', a: 'Absolutely. We act as an extension of your team, not a replacement — integrating with your ticketing and chat tools and providing clear runbooks your IT team can act on.' },
  ],

  contact: [
    { icon: 'mail',  label: 'Email',    value: 'security@troandigital.net' },
    { icon: 'phone', label: 'Phone',    value: '+234 703 912 5104' },
    { icon: 'pin',   label: 'Office',   value: 'Victoria Island, Lagos, Nigeria' },
    { icon: 'clock', label: 'SOC Desk', value: 'Open 24/7/365' },
  ],

  threatFeed: [
    { type: 'blocked', text: 'Brute-force attempt blocked · 41.x.x.18', },
    { type: 'blocked', text: 'Phishing domain quarantined · acme-login[.]net' },
    { type: 'alert',   text: 'Anomalous login flagged · Azure AD' },
    { type: 'blocked', text: 'Malware hash blocked · Emotet variant' },
    { type: 'live',    text: 'Threat hunt in progress · Endpoint fleet' },
    { type: 'blocked', text: 'Port scan dropped · perimeter firewall' },
    { type: 'alert',   text: 'Unusual data egress · investigating' },
    { type: 'blocked', text: 'Credential stuffing mitigated · 1,204 IPs' },
    { type: 'blocked', text: 'Ransomware behaviour contained · host-07' },
    { type: 'live',    text: 'SIEM correlation rule updated' },
  ],
};
