// Minimal date-range calendar utilities for the availability search
// No external library — native Date + Intl + semantic HTML

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export const MONTH_NAMES_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const MONTH_NAMES_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const DAY_NAMES_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
export const DAY_NAMES_ES = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];

export function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

export function isBeforeDay(a: Date, b: Date): boolean {
  const aa = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bb = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return aa < bb;
}

export function isAfterDay(a: Date, b: Date): boolean {
  return isBeforeDay(b, a);
}

export function isInRange(day: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  return !isBeforeDay(day, start) && !isAfterDay(day, end);
}

export function isRangeStart(day: Date, start: Date | null): boolean {
  return start !== null && isSameDay(day, start);
}

export function isRangeEnd(day: Date, end: Date | null): boolean {
  return end !== null && isSameDay(day, end);
}

export function formatDateISO(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function formatDateDisplay(d: Date, lang: "en" | "es"): string {
  const months = lang === "es" ? MONTH_NAMES_ES : MONTH_NAMES_EN;
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatDateShort(d: Date, lang: "en" | "es"): string {
  const m = d.toLocaleDateString(lang === "es" ? "es-US" : "en-US", { month: "short", day: "numeric" });
  return m;
}

export function getCalendarDays(year: number, month: number): (Date | null)[] {
  const days: (Date | null)[] = [];
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  return days;
}

export function generateTimes(): string[] {
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of ["00", "30"]) {
      times.push(`${String(h).padStart(2, "0")}:${m}`);
    }
  }
  return times;
}

export function formatTime12(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}