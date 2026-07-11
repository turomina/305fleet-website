#!/usr/bin/env node

// sync-vehicles.mjs — Build-time Airtable → vehicles.json sync
// 
// Phase 2: Pull vehicle records from Airtable, enrich with hand-written
// content, and output the merged vehicles.json used by Astro.
//
// This script runs during npm run build (via astro:build:done hook).
// It writes a merged array to src/data/vehicles.json.
//
// SECURITY: Only public-safe fields are written. VINs, tags, and
// internal Host/Setup categories are filtered out.
//
// TODO Phase 3: When Airtable schema is updated with Trim, Photos,
// Turo URL, Description fields, this script will pull those too.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(__dirname, "..", "data", "vehicles.json");
const AIRTABLE_BASE_ID = "appkmBi0ahPC7xWJW";
const AIRTABLE_TABLE = "Vehicles";

// Fields to exclude from output (sensitive / internal-only)
const SENSITIVE_FIELDS = new Set(["VIN", "Tag", "Mileage", "Host/Setup"]);

// Map Airtable field names → website field names
// Excludes fields that are sensitive or internal-only
const FIELD_MAP = {
  "Vehicle Name": "airtable_name",
  "Year": "year",
  "Make": "make",
  "Model": "model",
  "Color": "exterior_color",
  "Fuel Type": "fuel_type",
  "Availability Status": "availability_status",
  "Type": "type",
};

// Fuel type normalization
function normalizeFuel(raw) {
  const map = {
    "Gas- Regular": "gasoline",
    "Gas- Premium": "premium_gasoline",
    "Hybrid": "hybrid",
    "Plug-In Hybrid": "plug_in_hybrid",
    "Electric": "electric",
  };
  return map[raw] || "gasoline";
}

// Availability mapping
function normalizeAvailability(raw) {
  const map = {
    "Available": "available",
    "Rented": "rented",
    "Out of Service": "out_of_service",
    "In Service": "in_service",
  };
  return map[raw] || "unknown";
}

// Generate a URL-safe slug from year + make + model
function generateSlug(record) {
  const year = record.fields["Year"] || "0000";
  const make = (record.fields["Make"] || "unknown").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const model = (record.fields["Model"] || "unknown").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${year}-${make}-${model}`;
}

// Pull records from OpenClaw Airtable tool
// Note: this runs via the OpenClaw Airtable integration during build.
// For manual sync, records are fetched through the available airtable tools.
// This script is designed to be called during Astro build lifecycle.
async function fetchAirtableRecords() {
  // Phase 2: Manual population via airtable__list_records
  // Phase 3: Replace with proper Airtable API call using env vars
  console.log("[sync-vehicles] Airtable sync placeholder — manual data used");
  return null;
}

// Build a public-safe vehicle entry from an Airtable record + existing enrichments
function buildVehicle(airtableRecord, existingRecord) {
  const fields = airtableRecord.fields;
  const slug = generateSlug(airtableRecord);

  // Start with existing enriched data (descriptions, pricing, photos) or defaults
  const base = existingRecord || {};

  return {
    id: airtableRecord.id,
    slug,
    name: base.name || `${fields["Year"] || ""} ${fields["Make"] || ""} ${fields["Model"] || ""}`.trim(),
    year: fields["Year"] || null,
    make: fields["Make"] || null,
    model: fields["Model"] || null,
    trim: base.trim || null,
    exterior_color: fields["Color"] || null,
    interior_color: base.interior_color || null,
    passenger_capacity: base.passenger_capacity || null,
    luggage_large: base.luggage_large || null,
    luggage_carryon: base.luggage_carryon || null,
    fuel_type: normalizeFuel(fields["Fuel Type"] || "Gas- Regular"),
    type: (fields["Type"] || []).join(", "),
    availability_status: normalizeAvailability(fields["Availability Status"] || "unknown"),
    key_features: base.key_features || [],
    drivetrain: base.drivetrain || null,
    best_for: base.best_for || [],
    tagline_en: base.tagline_en || `${fields["Year"] || ""} ${fields["Make"] || ""} ${fields["Model"] || ""} — specifications and pricing coming soon.`.trim(),
    tagline_es: base.tagline_es || `${fields["Year"] || ""} ${fields["Make"] || ""} ${fields["Model"] || ""} — especificaciones y precios próximamente.`.trim(),
    description_en: base.description_en || "",
    description_es: base.description_es || "",
    turo_url: base.turo_url || null,
    hero_image: base.hero_image || null,
    gallery: base.gallery || [],
    price_display_daily: base.price_display_daily || null,
    price_display_weekly: base.price_display_weekly || null,
    price_display_monthly: base.price_display_monthly || null,
    publication_status: base.publication_status || "preview_only",
    verified: base.verified || false,
    last_updated: new Date().toISOString().split("T")[0],
    data_source: base.data_source || "airtable_manual",
  };
}

export { fetchAirtableRecords, buildVehicle, normalizeFuel, normalizeAvailability, generateSlug };