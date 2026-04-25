# AI for Nigeria — Research Report

> Five high-impact problems in Nigeria where AI can deliver measurable
> economic value, with proposed solutions and a build/ship plan for the top
> three. Compiled April 2026.

---

## Problem 1 — Digital payment fraud is bleeding the financial system

### Evidence
- **₦25.85B (~$18.8M)** lost to digital payment fraud in 2025 (NIBSS Annual
  Fraud Landscape). Down 51% YoY but only because 2024 was inflated by a
  single ₦31.1B incident.
- **67,518 fraud incidents** recorded in 2025 (4% YoY decline only).
- **Lagos = 63.4%** of fraud activity by volume.
- **Social engineering / insider abuse** is the #1 technique. E-commerce and
  internet banking are the most affected channels.
- Industry reporting fell 34% in Q4 2025 — a *bad* signal: more fraud is
  going untracked, not less is happening.
- Nigerians lost ~**₦300B** to fraudulent investment schemes in recent years.
- Real-time payments + slow fraud-intel sharing = "prevention is reactive."

### Why this is an AI problem
Rule-based fraud engines miss:
- Synthetic identity rings reusing devices across accounts.
- Mule-account graphs after account-takeover.
- Velocity / geo-impossibility patterns at scale.
- Behavioral drift (a real customer's typing/swiping pattern vs. a remote
  attacker driving their session).

A modern stack combines:
1. **Gradient-boosted classifier** on tabular transaction features.
2. **Graph features** linking devices, accounts, beneficiary BVNs.
3. **Behavioral biometrics** (where mobile SDK is integrated).
4. **LLM-assisted case review** for analysts (summary + reason codes).

### Proposed solution
A **real-time fraud scoring API** banks/fintechs call inline on every
transaction. Returns a risk score (0–100), reason codes, and a recommended
action (allow / step-up / block). Includes a feedback endpoint so confirmed
fraud labels retrain the model nightly. Ships as a Docker container, can run
on-prem (CBN data-residency friendly).

> **Built and shipped — see `solutions/01-fraud-detection-api/`**

### Buyers
Tier-1 banks (Access, GTCO, Zenith, UBA, FBN), Tier-2/3 banks, fintechs
(Moniepoint, OPay, PalmPay, Kuda, Paystack, Flutterwave), HMOs and insurers
on the receiving end of claim fraud.

---

## Problem 2 — MSME credit gap is choking the real economy

### Evidence
- **$32.2B unmet credit demand** for Nigerian MSMEs (IFC).
- **<5%** of MSMEs have access to formal bank credit (World Bank).
- World Bank approved **$500M FINCLUDE** facility (Dec 2025) to expand
  MSME finance. Programme explicitly targets "AI-enabled digital platforms"
  for loan appraisal, 250k MSMEs, 150k women-led, 100k agribusinesses.
- Average MSME loan tenor today is too short and too expensive.
- Collateral-based lending excludes most viable firms.

### Why this is an AI problem
Most Nigerian MSMEs are *invisible* to traditional underwriting:
- No 3 years of audited financials.
- No collateral.
- Cash-heavy operations.

But they leave **rich digital footprints**:
- POS / agency banking transaction streams (Moniepoint, OPay terminals).
- Mobile-money send/receive patterns.
- Bank statement aggregation (Mono, Okra, Stitch).
- Inventory / sales data from bookkeeping apps (Kippa, Bumpa).
- Telco airtime + data spend (where consented).

ML on these features can predict 12-month default probability far better
than a 1990s scorecard.

### Proposed solution
**Alternative-data credit scoring API**. Lender pushes the borrower's
linked-account data (or our SDK pulls via Mono/Okra), API returns:
- Probability of default (PD) at 30/60/90/180 days.
- Affordable-tenor and amount recommendation.
- Reason codes (CBN consumer-credit-disclosure compatible).
- Explainability (SHAP-style top features).

Ships as containerised API + a lightweight loan-officer web console.

> **Built and shipped — see `solutions/02-sme-credit-scoring/`**

### Buyers
Microfinance banks, digital lenders (FairMoney, Branch, Carbon, Renmoney,
Lendsqr, Migo), agritech lenders (ThriveAgric, Crop2Cash, Babban Gona),
DBN (Development Bank of Nigeria) partners, BoI, banks rolling out FINCLUDE.

---

## Problem 3 — Smallholder farmers can't reach extension agents

### Evidence
- Nigeria has ~**70% of agricultural output** from smallholders.
- FAO recommends **1 extension agent : 1,000 farmers**. Nigeria's reality
  is closer to **1 : 10,000**. In some states, worse.
- Climate volatility, fall armyworm, tomato leafminer, and rising input
  costs are eroding yields.
- Smartphone penetration is rising fast — feature phones still dominant in
  the North, so USSD/SMS coverage is non-negotiable.
- 60M+ Nigerians speak Pidgin; Yoruba/Hausa/Igbo each have 30–80M speakers.
- ICT4Ag pilots (Brookings, GSMA) show **+20–40% yield gains** when
  farmers receive timely, localised advice.

### Why this is an AI problem
LLMs (with retrieval over local agronomy guides) + open-source vision
models (for pest/disease ID from a photo) can collapse the extension gap
*at marginal cost*. Multilingual ASR/TTS (Spitch, Ajala.ai, NKENNEAi)
makes voice and IVR feasible for non-readers.

### Proposed solution
**Multilingual farmer assistant** on:
- WhatsApp (text + voice + photo).
- USSD (for feature phones).
- SMS fallback.

Capabilities:
- Pest/disease diagnosis from a leaf photo.
- Localised planting / spraying / harvesting advice (state + crop +
  rainfall window).
- Market price lookup.
- Input vendor + credit referrals (monetisation hook).

Backed by Claude API for reasoning + an open vision model for image
classification, with a retrieval index over Nigerian agronomy bulletins.

> **Built and shipped — see `solutions/03-farmer-ai-agronomist/`**

### Buyers
Agritech operators (ThriveAgric, Crop2Cash, Babban Gona, Releaf,
Hello Tractor), input companies (Notore, Indorama Eleme, Saro Agro,
Syngenta Nigeria), state ADPs (Agricultural Development Programmes),
donor programmes (AGRA, IFAD VCDP, GIZ, USAID Feed the Future),
agro-insurance (Leadway, AXA Mansard), FMCG outgrower schemes
(Nestlé, Olam, Promasidor, Flour Mills).

---

## Problem 4 — Healthcare diagnostic gap (research only — not built)

### Evidence
- **3.8 doctors per 10,000** people in Nigeria; <1 per 2,600 in many states.
- Radiologists overwhelmingly concentrated in Lagos, Abuja, Port Harcourt.
- Rural primary health centres often have no specialist coverage at all.
- Telemedicine adoption growing (12+ active startups, 78% of city
  hospitals offer video visits) but rural broadband + power are the choke
  points.
- "Japa" exodus has accelerated medical workforce attrition.

### Proposed solution (designed, not built here)
- **AI triage + teleradiology assistant** for primary-health-centre nurses.
- Symptom intake → red-flag triage → connect to remote specialist.
- DICOM-in / report-out for chest X-rays and basic ultrasound, with a
  human radiologist in the loop. (FDA-cleared and CE-marked underlying
  models — e.g., Lunit, Annalise.ai — are already proven in similar
  African deployments.)
- Designed for low-bandwidth: store-and-forward over MTN/Airtel coverage
  with progressive sync.

### Why we did **not** build this in this batch
Regulatory load: NAFDAC SaMD pathway, NHIA integration, HIPAA-equivalent
data handling, and clinical validation pilots are 6–12 month items, not
shippable in a single build. Recommend partnering with a registered
medical-device entity (e.g., **54gene successor entities, Helium Health**)
rather than greenfield.

### Buyers (when ready)
Federal Ministry of Health, state Ministries of Health, NHIA, large HMOs
(AXA Mansard, Hygeia, Reliance, Avon, Bastion), private hospital chains
(Reddington, Lagoon, Lily, Evercare), donors (BMGF, Global Fund, GAVI).

---

## Problem 5 — Education / learning poverty (research only — not built)

### Evidence
- **92% learning poverty** rate (World Bank PISA-equivalent, 2022).
- **2025 WAEC**: 38.32% obtained 5 credits incl. English/Maths (later
  revised to 87.24% after WAEC admitted a marking-key error — the noise
  itself shows how broken the assessment chain is).
- **2025 JAMB UTME**: 78.5% scored below 200/400. ~439k candidates
  *passed*.
- Teacher quality + class sizes + out-of-school children compound.

### Proposed solution (designed, not built here)
- **AI tutor for WAEC / JAMB prep**, mobile-first, offline-capable.
- Adaptive practice from past papers, weakness diagnosis, voice
  explanations in Pidgin/Yoruba/Hausa/Igbo.
- B2C subscription (₦1,500–₦3,000/month) + B2B school licensing.
- Optional teacher dashboard.

### Why we did **not** build this in this batch
Strong existing competition (uLesson, Klas, Edves, FlexiSAF) and a long
B2C CAC payback. The technical build itself is straightforward; the
defensible go-to-market is the hard part. Recommend acquiring an existing
content moat or partnering with a state government before greenfield
build.

### Buyers (when ready)
State Ministries of Education (especially Lagos, Kaduna, Edo, Ekiti),
UBEC (Universal Basic Education Commission), TETFund, private school
chains (Greensprings, Lekki British, Chrisland, Whiteplains), edtechs
acquiring content + AI capability.

---

## Build prioritisation summary

| # | Problem | Build status | Why this priority |
|---|---------|--------------|-------------------|
| 1 | Payment fraud | **Shipped** (`solutions/01-...`) | Clear ROI per-call, banks have budget today, technically tractable, no regulatory blocker |
| 2 | MSME credit gap | **Shipped** (`solutions/02-...`) | $500M FINCLUDE facility actively buying AI-enabled appraisal; willing buyers in 30+ lenders |
| 3 | Farmer extension | **Shipped** (`solutions/03-...`) | Massive unit economics (sub-cent per query), donor money, fits existing WhatsApp/USSD rails |
| 4 | Healthcare diagnostics | Design only | Regulatory pathway makes "ship in days" infeasible; needs partner |
| 5 | Education / WAEC tutor | Design only | Crowded market, B2C CAC heavy; commercial moat matters more than tech |

Buyer list with public contact channels: **`docs/buyers-outreach-list.md`**.
