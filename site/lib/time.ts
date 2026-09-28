import { TOTAL_WEEKS } from "@/lib/programme";

const DAY = 86_400_000;

export function today() {
  return new Date(new Date().toISOString().slice(0, 10));
}

// Semaine de l'accompagnement, de 1 à 26
export function weekOf(start: string) {
  const days = Math.floor((today().getTime() - new Date(start).getTime()) / DAY);
  return Math.min(TOTAL_WEEKS, Math.max(1, Math.floor(days / 7) + 1));
}

export function daysLeft(end: string) {
  return Math.ceil((new Date(end).getTime() - today().getTime()) / DAY);
}

export function isEnded(end: string) {
  return daysLeft(end) < 0;
}

const long = new Intl.DateTimeFormat("fr-CH", { day: "numeric", month: "long" });
const short = new Intl.DateTimeFormat("fr-CH", { day: "numeric", month: "short" });
const full = new Intl.DateTimeFormat("fr-CH", { day: "numeric", month: "long", year: "numeric" });

export const fmt = {
  long: (d: string) => long.format(new Date(d)),
  short: (d: string) => short.format(new Date(d)),
  full: (d: string) => full.format(new Date(d)),
};

export function addMonths(d: string, n: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x.toISOString().slice(0, 10);
}

export function isoDaysAgo(n: number) {
  return new Date(Date.now() - n * DAY).toISOString().slice(0, 10);
}
