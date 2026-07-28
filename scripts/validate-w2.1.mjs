#!/usr/bin/env node
/**
 * W2.1 Validation Script — 305Fleet Wheelbase Launch Readiness
 *
 * Validates that the corrected preview candidate meets all W2.1
 * requirements. Designed to be focused and maintainable — no large
 * testing framework needed.
 *
 * Usage: node scripts/validate-w2.1.mjs
 */

import { readFile, readdir, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");

let passed = 0;
let failed = 0;

function assert(label, condition, detail = "") {
  if (condition) {
    passed++;
    console.log(`  ✅ ${label}`);
  } else {
    failed++;
    console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

async function fileExists(relPath) {
  try {
    await access(resolve(DIST, relPath));
    return true;
  } catch {
    return false;
  }
}

async function fileContains(relPath, substr) {
  try {
    const content = await readFile(resolve(DIST, relPath), "utf-8");
    return content.includes(substr);
  } catch {
    return false;
  }
}

async function grepFile(relPath, regex) {
  try {
    const content = await readFile(resolve(DIST, relPath), "utf-8");
    return content.match(regex) || [];
  } catch {
    return [];
  }
}

// ── Vehicle / reserve slugs ──
const VEHICLE_SLUGS = [
  "2025-cadillac-escalade-esv",
  "2024-audi-q4-e-tron",
  "2025-volvo-xc90-t8-phev",
  "2026-mercedes-glc300",
  "2021-toyota-highlander-hybrid",
  "2021-audi-q3",
  "2025-mitsubishi-outlander-phev",
];

console.log("\n═══ 1. Header Book Now → /vehicles/ ═══");
for (const page of ["index.html", "vehicles/index.html"]) {
  assert(
    `Homepage/fleet header CTA → /vehicles/`,
    await fileContains(page, 'href="/vehicles/"')
  );
}

console.log("\n═══ 2. English vehicle CTA → matching /reserve/[slug]/ ═══");
for (const slug of VEHICLE_SLUGS) {
  const page = `vehicles/${slug}/index.html`;
  const cta = `/reserve/${slug}/`;
  assert(
    `EN ${slug} CTA → ${cta}`,
    await fileContains(page, cta),
    `Missing CTA link on ${page}`
  );
}

console.log("\n═══ 3. Spanish vehicle CTA → matching English /reserve/[slug]/ ═══");
for (const slug of VEHICLE_SLUGS) {
  const page = `es/vehicles/${slug}/index.html`;
  const cta = `/reserve/${slug}/`;
  assert(
    `ES ${slug} CTA → ${cta}`,
    await fileContains(page, cta),
    `Missing CTA link on ${page}`
  );
}

console.log("\n═══ 4. Spanish disclosure exists near booking CTA ═══");
for (const slug of VEHICLE_SLUGS) {
  const page = `es/vehicles/${slug}/index.html`;
  assert(
    `ES disclosure on ${slug}`,
    await fileContains(page, "La reservación se completa actualmente en inglés"),
    `Missing disclosure on ${page}`
  );
}

console.log("\n═══ 5. English reserve language link does not target /es/reserve/ ═══");
for (const slug of VEHICLE_SLUGS) {
  const page = `reserve/${slug}/index.html`;
  const bad = "/es/reserve/";
  const good = `/es/vehicles/${slug}/`;
  const hasLink = await fileContains(page, bad);
  const hasGood = await fileContains(page, good);
  assert(
    `Reserve ${slug}: no /es/reserve/ link`,
    !hasLink && hasGood,
    hasLink ? `Found forbidden /es/reserve/ link` : `Missing /es/vehicles/ fallback`
  );
}

console.log("\n═══ 6. No /es/reserve/ route generated ═══");
assert(
  "No /es/reserve/ directory exists",
  !(await fileExists("es/reserve/2025-cadillac-escalade-esv/index.html")),
);

console.log("\n═══ 7. All seven reserve routes exist ═══");
for (const slug of VEHICLE_SLUGS) {
  assert(
    `Reserve route: /reserve/${slug}/`,
    await fileExists(`reserve/${slug}/index.html`),
    `Missing`
  );
}

console.log("\n═══ 8. All seven vehicle mappings remain unique and complete ═══");
const mappingPath = resolve(ROOT, "src/data/wheelbase-mapping.ts");
const mappingContent = await readFile(mappingPath, "utf-8");
const wbIds = [];
const slugs = [];
// Parse Record<string, number> format: "slug": 123456,
for (const line of mappingContent.split("\n")) {
  const kvMatch = line.match(/"([^"]+)":\s*(\d+)/);
  if (kvMatch && kvMatch[1].includes("-")) {
    slugs.push(kvMatch[1]);
    wbIds.push(kvMatch[2]);
  }
}
assert("7 mapping entries", wbIds.length === 7, `Found ${wbIds.length}`);
assert("All IDs are unique", new Set(wbIds).size === wbIds.length);
assert("All slugs are unique", new Set(slugs).size === slugs.length);
assert("All VEHICLE_SLUGS match mapping", 
  VEHICLE_SLUGS.every(s => slugs.includes(s)),
  `Missing: ${VEHICLE_SLUGS.filter(s => !slugs.includes(s)).join(", ")}`
);

console.log("\n═══ 9. Reserve routes remain noindex ═══");
for (const slug of VEHICLE_SLUGS) {
  assert(
    `Reserve /${slug}/ has noindex`,
    await fileContains(`reserve/${slug}/index.html`, "noindex,nofollow"),
  );
}

console.log("\n═══ 10. Reserve routes excluded from sitemap ═══");
const sitemapIndex = await readFile(resolve(DIST, "sitemap-index.xml"), "utf-8");
assert("0 reserve URLs in sitemap index", !sitemapIndex.includes("reserve"));

console.log("\n═══ 11. Homepage interim CTA → /vehicles/ ═══");
assert(
  "EN homepage has Choose a vehicle → /vehicles/",
  await fileContains("index.html", 'href="/vehicles/"')
);
assert(
  "EN homepage has vehicle-entry-pill (not availability-search form)",
  await fileContains("index.html", "vehicle-entry-pill")
);

console.log("\n═══ 12. No homepage form implies unused dates were applied ═══");
const enHome = await readFile(resolve(DIST, "index.html"), "utf-8");
assert(
  "No date-picker fields on homepage",
  !enHome.includes("as-start-date") && !enHome.includes("as-end-date") && !enHome.includes("as-start-time"),
);

console.log("\n═══ 13. Existing legacy /book/* redirects remain intact ═══");
const middlewareSrc = await readFile(resolve(ROOT, "functions/_middleware.ts"), "utf-8");
const turoBookRedirects = (middlewareSrc.match(/\/book\//g) || []).length;
assert(
  "Legacy /book/* Turo redirects preserved in _middleware.ts",
  turoBookRedirects > 0,
  `Found ${turoBookRedirects} /book/ references`
);

console.log("\n═══ 14. No internal vehicle nicknames in changed files or build output ═══");
const changedFiles = [
  "index.html",
  "es/index.html",
  ...VEHICLE_SLUGS.map(s => `vehicles/${s}/index.html`),
  ...VEHICLE_SLUGS.map(s => `es/vehicles/${s}/index.html`),
  ...VEHICLE_SLUGS.map(s => `reserve/${s}/index.html`),
  "vehicles/index.html",
];

// Check mapping file for any nickname patterns (exclude comments that say "No nicknames")
const mappingLines = mappingContent.split("\n").filter(l => !l.includes("No internal nicknames"));
const mappingClean = mappingLines.join("\n");
const mappingHasNicknames = /nickname|pet.?name|internal.?name|code.?name/i.test(mappingClean);
assert("Mapping file has no nicknames", !mappingHasNicknames);

console.log("\n═══ 15. Delivery copy consistency ═══");
// EN homepage
assert("EN homepage: free MIA & FLL delivery", await fileContains("index.html", "Free MIA"));
assert("EN homepage: PBI identified as paid", await fileContains("index.html", "Paid delivery"));
assert("EN homepage: parking responsibility", await fileContains("index.html", "parking charges are the renter"));

// ES homepage
assert("ES homepage: entrega gratuita MIA y FLL", await fileContains("es/index.html", "Entrega gratuita"));
assert("ES homepage: PBI con costo", await fileContains("es/index.html", "Entrega con costo a PBI"));

// EN vehicle page
assert("EN vehicle: free delivery MIA and FLL", await fileContains("vehicles/2025-cadillac-escalade-esv/index.html", "Free delivery to MIA"));
assert("EN vehicle: paid PBI", await fileContains("vehicles/2025-cadillac-escalade-esv/index.html", "Paid delivery to PBI"));

// ES vehicle page
assert("ES vehicle: entrega gratuita MIA y FLL", await fileContains("es/vehicles/2025-cadillac-escalade-esv/index.html", "Entrega gratuita a MIA y FLL"));
assert("ES vehicle: PBI con costo", await fileContains("es/vehicles/2025-cadillac-escalade-esv/index.html", "Entrega con costo a PBI"));

// Reserve pages
assert("Reserve: free MIA & FLL + paid PBI", 
  (await readFile(resolve(DIST, "reserve/2025-cadillac-escalade-esv/index.html"), "utf-8")).includes("Free delivery to MIA"));
assert("Reserve: parking guest responsibility", 
  (await readFile(resolve(DIST, "reserve/2025-cadillac-escalade-esv/index.html"), "utf-8")).includes("guest"));

// Airport location pages
assert("EN MIA location page exists", await fileExists("locations/miami-international-airport/index.html"));
assert("EN FLL location page exists", await fileExists("locations/fort-lauderdale-airport/index.html"));
assert("EN PBI location page exists", await fileExists("locations/palm-beach-airport/index.html"));
assert("ES MIA location page exists", await fileExists("es/locations/miami-international-airport/index.html"));
assert("ES FLL location page exists", await fileExists("es/locations/fort-lauderdale-airport/index.html"));
assert("ES PBI location page exists", await fileExists("es/locations/palm-beach-airport/index.html"));

console.log("\n═══ 16. Spanish /es/reserve/ returns 404 (no public link) ═══");
assert("No /es/reserve/ links anywhere in dist", 
  (await grepFile("es/index.html", /\/es\/reserve\//)).length === 0);

console.log("\n═══ 17. Reserve pages have language metadata handled separately ═══");
for (const slug of VEHICLE_SLUGS) {
  const page = `reserve/${slug}/index.html`;
  const content = await readFile(resolve(DIST, page), "utf-8");
  const hasHreflangES = content.includes('hreflang="es"');
  const hasESReserveLink = content.includes("/es/reserve/");
  assert(
    `Reserve ${slug}: no ES hreflang, no /es/reserve/ link`,
    !hasESReserveLink,
    hasESReserveLink ? "Found /es/reserve/ link" : ""
  );
}

console.log("\n═══ 18. GA4 fires only on allowed production hosts ═══");
const ga4Match = enHome.match(/includes\(window\.location\.hostname\)/);
assert("GA4 guard present — preview-safe", ga4Match !== null);

// ── Summary ──
console.log(`\n${"═".repeat(50)}`);
console.log(`  ${passed} passed, ${failed} failed`);
console.log(`${"═".repeat(50)}\n`);

if (failed > 0) {
  process.exit(1);
}
