# Investigation Report: Domain Routing Issue - Sep 6, 2026

## What Happened

**Root Cause:** The `lipp-website` Cloudflare Pages project was modified 2 hours ago (same time as our 305Fleet work). Something triggered a new build/deployment of the LIPP project, but it appears to have served 305Fleet content on `livinginpembrokepines.org`.

## Evidence

### Cloudflare Pages Projects (current state):
| Project | Domains | Last Modified |
|---------|---------|---------------|
| **305fleet-website** | 305fleet-website.pages.dev | ~2h ago ← OUR PREVIEW DEPLOYMENT |
| **lipp-website** | lipp-website.pages.dev, **livinginpembrokepines.org**, www.livinginpembrokepines.org | ~2h ago ← UNEXPECTED CHANGE |
| **305fleet-website-git** | 305fleet-website-git.pages.dev, **305fleet.com**, www.305fleet.com | ~3h ago |
| living-in-pembroke-pines | living-in-pembroke-pines.pages.dev | 1 week ago |

### Live Content Check:
- `https://livinginpembrokepines.org` → Serving **305 Fleet** HTML (`<title>South Florida Direct Vehicle Rentals | 305 Fleet</title>`) ❌ WRONG
- `https://305fleet.com` → Serving **305 Fleet** HTML ✅ CORRECT

### Source Code Status:
- **305Fleet src/**: Changes exist (phone number update, unstaged git changes) — all intentional
- **LIPP src/**: No modifications to tracked files — source code SAFE
- **LIPP dist/**: Unchanged (last modified Sep 4) — LIPP production build NOT overwritten locally

## Conclusion

This is a **Cloudflare Pages custom domain routing issue**, NOT a source file overwrite.

The `lipp-website` project was rebuilt/deployed ~2 hours ago (possibly by another CI workflow, auto-sync, or accidental manual deploy). When this rebuild happened, it served 305Fleet content on the livinginpembrokepines.org domain instead of LIPP content.

## Recovery Plan

### DO NOT DEPLOY ANYTHING YET.

1. **Immediate mitigation**: 
   - Identify what triggered the `lipp-website` rebuild 2h ago
   - Check if a stale/wrong commit was synced to lipp-website's git repo
   - Roll back `lipp-website` to last known-good production deployment in CF dashboard

2. **Verify domain assignments**:
   - Confirm `livinginpembrokepines.org` is bound ONLY to `lipp-website` project
   - Confirm `305fleet.com` is bound ONLY to `305fleet-website-git` project  
   - Check for any DNS/proxy rules that might route traffic incorrectly

3. **Restore LIPP production**:
   - Deploy LAST KNOWN GOOD LIPP build from before today's 305Fleet work
   - Verify `livinginpembrokepines.org` shows LIPP content again

4. **After LIPP restored, handle 305Fleet separately**:
   - Commit 305FPhone phone changes to 305Fleet git repo
   - Build 305Fleet fresh
   - Deploy to `305fleet-website-git` (or whichever project owns 305fleet.com)
   - Verify only 305fleet.com shows 305Fleet content

## Files NOT affected:
- ✅ All LIPP source files intact (git status = no tracked file modifications)
- ✅ Local LIPP `dist/` unchanged (Sep 4 timestamp)
- ✅ 305Fleet changes preserved in local workspace

## Next Steps for Ian:
1. Please confirm who/what triggered the lipp-website deploy ~2h ago (Jon? Auto-CI? Manual?)
2. Do NOT approve any further deployments until LIPP is restored
3. We need to access the CF Pages dashboard for the `lipp-website` project to roll back
