# Security Audit — troandigital.net

**Scope:** Public marketing website (static HTML/CSS/JS), contact-form pipeline,
Apache/LiteSpeed hardening (`.htaccess`), CI/CD deploy pipeline (GitHub Actions + FTPS),
and the Namecheap cPanel hosting environment.
**Audit date:** 2026-05-29
**Auditor:** Internal review (pre–Managed-Agent baseline)
**Methodology:** Manual code review, configuration review, threat-model walkthrough.
Findings classified **Critical / High / Medium / Low / Observation**.

---

## Executive summary

The website itself is a static, dependency-free site with a sound security posture:
strong CSP, HSTS, clickjacking and MIME-sniffing protections, a honeypot-protected
contact form, and no server-side code. **Residual risk is concentrated in the hosting
environment**, which was previously compromised (malicious PHP mailer/spam files). Until
the host is confirmed clean and all credentials are rotated, overall risk is **HIGH**.

| Area | Status |
|------|--------|
| Application (front-end) code | ✅ Low risk |
| Transport / headers | ✅ Strong |
| Contact-form pipeline | 🟡 Acceptable with notes |
| CI/CD secrets | 🟡 Acceptable with notes |
| **Hosting environment (post-compromise)** | 🔴 **Action required** |

---

## Findings

### 🔴 CRITICAL

**C-1 — Prior server compromise not yet fully remediated.**
Malicious PHP files (`bulk.php`, `forms.php`, `short.php`, `legacy.php`, `user.php`,
`ssl-manager.php`) were found and deleted, but residual artifacts remained in
`public_html` (`.ssl-manager/`, `.htaccess.bk`, `.pset`, `.bind`, `.itm`). Attackers who
gain code execution routinely plant **multiple** persistence mechanisms.
**Remediation (do all):**
1. Delete the residual files listed above (`.ssl-manager/`, `.htaccess.bk`, `.pset`, `.bind`, `.itm`).
2. Run a full malware scan of the **entire** `/home/troaddib` (Imunify360 / Jellyfish), not just `public_html`.
3. Inspect cron jobs (`crontab -l`, cPanel → Cron Jobs) for unknown entries.
4. Review `~/.ssh/authorized_keys`, mail filters/forwarders, and `.bashrc`/`.bash_profile` for backdoors.
5. Check the mail queue for spam backlog (compromise signature) and outbound reputation.
**Owner:** Hosting admin · **Target:** within 48h.

**C-2 — Rotate all credentials.**
Because the host was compromised, treat cPanel password, **all** FTP account passwords,
and email account passwords as exposed.
**Remediation:** Reset cPanel password, recreate/rotate the deploy FTP account password,
update the `TROAN_FTP_PASSWORD` GitHub secret to match, rotate `contact@`/`security@` mailbox
passwords, enable 2FA on the Namecheap account. **Owner:** Hosting admin · **Target:** immediate.

### 🟠 HIGH

**H-1 — Server-wide directory listing was enabled.**
The server root returned an `Index of /` listing (cgi-bin exposed). Information disclosure.
**Remediation:** `Options -Indexes` is now set in the site `.htaccess`; confirm it applies
and consider setting it at the account level. **Status:** mitigated for the docroot.

### 🟡 MEDIUM

**M-1 — Third-party form processor receives PII.**
The contact form posts name/company/email/message to `formsubmit.co`. This is a reasonable
no-backend choice, but submitted personal data transits a third party.
**Remediation:** Add a short privacy line near the form / a privacy policy link stating data
is processed by FormSubmit; confirm this is acceptable under NDPR/GDPR for your use.
**Status:** partially addressed (form note present); privacy policy recommended.

**M-2 — No Subresource Integrity (SRI) on Google Fonts.**
Fonts load from `fonts.googleapis.com` / `fonts.gstatic.com` without SRI. CSP restricts the
origins, lowering risk, but a compromised CDN response is not integrity-checked.
**Remediation:** Acceptable given CSP scoping; optionally self-host fonts to remove the
third-party dependency entirely.

**M-3 — CSP allows `'unsafe-inline'` for styles.**
Required by inline style usage. Low exploitability for a static site (no user-rendered HTML),
but not best-practice.
**Remediation:** Acceptable; could move to nonce/hash-based styles in a future pass.

### 🔵 LOW

**L-1 — Email addresses exposed in markup** (`mailto:` links) — harvestable for spam.
Accepted trade-off for contact convenience.

**L-2 — Verbose server banner.** LiteSpeed advertises its name/version on error pages.
Minor; `X-Powered-By` is already unset via `.htaccess`.

### ⚪ OBSERVATIONS

- **O-1** Static site = minimal attack surface (no DB, no auth, no server-side code). Good.
- **O-2** Honeypot (`_honey`) + client-side validation protect the form from basic bots.
- **O-3** Deploy uses **FTPS** (encrypted) — good. Consider migrating to SFTP/key-based or
  GitHub Actions OIDC if the host supports it.
- **O-4** `.htaccess` now blocks dotfiles, backups, logs, and **execution of PHP/CGI** in the
  docroot — so any future malicious `.php` drop cannot be served from the site root.

---

## Compliance snapshot (lightweight)

| Framework | Relevant control | State |
|-----------|------------------|-------|
| NDPR / GDPR | Lawful processing notice for form PII | 🟡 Add privacy policy |
| OWASP ASVS L1 | Security headers, transport security | ✅ Met (CSP/HSTS/XFO/XCTO) |
| CIS / hardening | Disable dir listing, block script exec | ✅ Met in docroot |
| Incident response | Post-compromise cleanup & cred rotation | 🔴 In progress (C-1, C-2) |

---

## Remediation roadmap

| # | Action | Priority | ETA |
|---|--------|----------|-----|
| C-1 | Full host malware scan + delete residual artifacts + check persistence | Critical | 48h |
| C-2 | Rotate cPanel/FTP/email creds, enable 2FA | Critical | Immediate |
| H-1 | Confirm directory listing disabled account-wide | High | 1 week |
| M-1 | Publish privacy policy / form data-processing notice | Medium | 2 weeks |
| M-2 | (Optional) Self-host fonts | Medium | Backlog |
| M-3 | (Optional) Nonce-based CSP for styles | Medium | Backlog |

> Note: this file is denied to web visitors by `.htaccess` (`.md` blocked) and is intended
> as an internal record.
