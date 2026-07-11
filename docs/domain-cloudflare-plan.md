# 305 Fleet — Domain & Cloudflare Plan

**Version:** 1.0
**Date:** 2026-07-10
**Status:** Draft — Pending Ian decisions and credentials

---

## Domain Status

| Property | Value |
|---|---|
| Domain | `305Fleet.com` |
| Registrar | GoDaddy |
| Ownership | Ian (confirmed) |
| Current Nameservers | `ns27.domaincontrol.com` / `ns28.domaincontrol.com` (GoDaddy) |
| On Cloudflare? | No |
| Current Site | GoDaddy parked/forwarding page (not a real website) |
| Email Provider | Google Workspace |

---

## Current DNS Records (from Jon's audit)

| Type | Name | Value | Purpose | Preserve? |
|---|---|---|---|---|
| NS | 305fleet.com | ns27/ns28.domaincontrol.com | GoDaddy nameservers | Replace if migrating to CF |
| A | 305fleet.com | 76.223.105.230, 13.248.243.5 | GoDaddy forwarding/parking | Remove (parking only) |
| CNAME | www.305fleet.com | 305fleet.com | www → apex redirect | Keep or recreate |
| MX | 305fleet.com | 1 smtp.google.com | Google Workspace email | **CRITICAL** |
| TXT | 305fleet.com | v=spf1 include:_spf.google.com ~all | SPF for Google Mail | **CRITICAL** |
| TXT | 305fleet.com | google-site-verification=Tr4vc-uPj7PYtaaW70VkGu4W6Hf2wX5PvWt4Nagvna0 | Google Search Console | Preserve |
| TXT | _dmarc.305fleet.com | v=DMARC1; p=quarantine; ... | DMARC policy | Preserve |
| TXT | google._domainkey.305fleet.com | v=DKIM1; k=rsa; p=... | Google Workspace DKIM | **CRITICAL** |
| SOA | 305fleet.com | ns27.domaincontrol.com | Default SOA | Auto-generated after migration |

**Critical findings:**
- Email is active through Google Workspace (MX, SPF, DKIM, DMARC all present)
- Current site is a GoDaddy parking page — no real content to preserve
- Domain is NOT on Cloudflare — would need to be added

---

## Deployment Architecture

```
Local Dev (localhost:4321)
    │
    ▼
GitHub → Cloudflare Pages Preview (305fleet-website.pages.dev)
    │                                                     
    ├─ feat/* branch → unique preview URL (noindex)
    ├─ dev branch → dev.305fleet-website.pages.dev (noindex)
    └─ main branch → production (attached to 305Fleet.com when approved)
```

## Options for DNS & Hosting

### Option A: Full Cloudflare DNS Migration (Recommended for Production)

1. Add `305Fleet.com` to Cloudflare dashboard
2. Cloudflare scans and imports all existing DNS records
3. Verify MX, SPF, DKIM, DMARC, and TXT records are correctly imported
4. Change nameservers at GoDaddy from GoDaddy to Cloudflare-assigned
5. Wait for propagation (minutes to hours)
6. Attach Cloudflare Pages custom domain to `305Fleet.com`

**Pros:** Full Cloudflare protection, SSL, CDN, email security, one dashboard
**Cons:** Nameserver change required; brief propagation risk for email
**Ian approval needed:** Yes

### Option B: Keep GoDaddy DNS, Add CNAME (Safest for Preview)

1. Keep GoDaddy as authoritative DNS
2. Add CNAME record at GoDaddy: `www.305fleet.com → 305fleet-website.pages.dev`
3. Use Cloudflare Pages with just the custom domain (no DNS migration)
4. Existing MX, SPF, DKIM, DMARC records remain untouched at GoDaddy

**Pros:** Zero risk to email; no nameserver change; fastest to set up
**Cons:** No Cloudflare DNS features (proxying, WAF, caching); two dashboards
**Ian approval needed:** Minimal (just add CNAME at GoDaddy)

### Option C: Hybrid (Recommended Path)

**Preview phase (now):** Option B — CNAME at GoDaddy, no DNS migration. Preview on pages.dev.
**Production phase (later):** Option A — Full Cloudflare DNS migration before production launch.

---

## Preview Deployment Plan

| Step | Action | Who | Status |
|---|---|---|---|
| 1 | Create GitHub repo `305fleet-website` | Ian (or Nik via token) | ⏳ Needs Ian |
| 2 | Set up Git remote | Nik | Blocked on Step 1 |
| 3 | Push main branch | Nik | Blocked on Step 1 |
| 4 | Create CF Pages project `305fleet-website` | Nik/Jon | ⏳ Needs CF token |
| 5 | Configure Astro 7 build in CF dashboard | Nik/Jon | Blocked on Step 4 |
| 6 | First deployment to `pages.dev` | CF (auto or manual) | Blocked on Steps 1+4 |
| 7 | Add no-index middleware | Nik | Ready (code prepared) |
| 8 | Verify preview URL | Nik | After deploy |
| 9 | Add CNAME at GoDaddy (if desired) | Ian/Jon | After preview confirmed |

## Production Deployment Plan

| Step | Action | Who | Status |
|---|---|---|---|
| 1 | All content verified and approved | Ian | Future |
| 2 | Full DNS audit complete | Jon | ✅ Done |
| 3 | Custom domain attached in CF Pages | Nik/Jon | Future |
| 4 | DNS records verified (MX, SPF, DKIM, DMARC) | Jon | Future |
| 5 | Nameserver change at GoDaddy (if migrating) | Ian | Future |
| 6 | SSL provisioning (auto by CF) | CF | After domain attached |
| 7 | Production launch approval | Ian | Future |
| 8 | Attach `305Fleet.com` to CF Pages production | Nik/Jon | Future |
| 9 | Remove no-index from production | Nik | After launch |
| 10 | Monitoring and verification | Nik/Jon | Post-launch |

## Rollback Plan

| Scenario | Rollback Action |
|---|---|
| Preview deployment broken | `git revert <commit>` + push → CF Pages re-deploys previous |
| Production site broken | `git revert <commit>` + push → CF Pages deploys previous version |
| DNS migration causes email issues | Change nameservers back to GoDaddy at GoDaddy registrar |
| Custom domain breaks | Remove domain from CF Pages → site reverts to pages.dev |
| Build fails | Fix locally, rebuild, push. Previous deploy remains live |

## Actions Requiring Ian

| # | Action | Urgency | Risk if Delayed |
|---|---|---|---|
| 1 | **Create GitHub PAT or repo** — to push code to GitHub | Medium | Preview deployment blocked |
| 2 | **Create CF API token** — new Pages:Edit token (separate from LIPP) | Medium | Preview deployment blocked |
| 3 | **Decide DNS migration timing** — Move to Cloudflare now or keep GoDaddy DNS? | Low | Can defer to production launch |
| 4 | **Confirm Google Workspace** — Is it actively used for 305Fleet.com email? | Low (assumed yes) | Email disruption if wrong |

## Actions Jon/Nik Can Do Independently

| Action | Who |
|---|---|
| Git local → remote push (when repo exists) | Nik |
| CF Pages project creation (when token exists) | Nik |
| No-index middleware for preview | Nik |
| Brand assets, pages, content, build | Nik |
| DNS records to preserve | Nik (documented above) |
| Custom domain setup in CF Pages | Jon for approval |

## No-Index Strategy (Preview)

The preview site (`*.pages.dev`) must not be indexable by search engines. Implementation:

1. **Primary:** Pages Function middleware at `functions/_middleware.ts` that injects `X-Robots-Tag: noindex` when `env.CF_PAGES_BRANCH !== 'main'`
2. **Backup:** `public/robots.txt` with `Disallow: /` for preview branches
3. **Production:** Only `main` branch gets a domain with search-engine indexing

The no-index middleware checks `env.CF_PAGES_BRANCH` (injected by Cloudflare at deploy time). If the branch is not `main`, it adds the `X-Robots-Tag: noindex` header to all responses.