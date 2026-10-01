import "server-only";
import QRCode from "qrcode";
import type { Member, Settings } from "@/lib/data";

// Montants, IBAN et QR de paiement. L'IBAN vient des réglages, saisi par Gael.

export const DEFAULT_PRICE = { nota: 4000, nota_plus: 8000, repli: 3000 } as const;

export function money(n: number, currency = "EUR") {
  const v = n.toLocaleString("fr-CH", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return currency === "EUR" ? `${v} €` : `${v} ${currency}`;
}

export function balance(m: Member) {
  return Math.max(0, (m.price ?? 0) - (m.paid_amount ?? 0));
}

export const cleanIban = (iban: string) => iban.replace(/\s+/g, "").toUpperCase();
export const formatIban = (iban: string) => cleanIban(iban).replace(/(.{4})/g, "$1 ").trim();

// Contrôle modulo 97 : évite d'afficher un IBAN mal recopié
export function validIban(iban: string) {
  const s = cleanIban(iban);
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s)) return false;
  const r = (s.slice(4) + s.slice(0, 4)).replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let mod = 0;
  for (const ch of r) mod = (mod * 10 + Number(ch)) % 97;
  return mod === 1;
}

export function reference(m: Member) {
  return `Nota ${m.full_name || m.email}`.slice(0, 140);
}

// QR-facture suisse (IBAN CH/LI) ou code SEPA (IBAN européen, en euros)
function payload(m: Member, s: Settings, amount: number): { kind: "swiss" | "sepa"; data: string } | null {
  const iban = cleanIban(s.iban ?? "");
  if (!validIban(iban) || !s.beneficiary) return null;
  const currency = s.currency || "EUR";
  const amt = amount > 0 ? amount.toFixed(2) : "";
  if (/^(CH|LI)/.test(iban)) {
    if (!s.postal_code || !s.town || !["CHF", "EUR"].includes(currency)) return null;
    const lines = [
      "SPC", "0200", "1", iban,
      "S", s.beneficiary.slice(0, 70), (s.street ?? "").slice(0, 70), "", s.postal_code.slice(0, 16), s.town.slice(0, 35), (s.country || "CH").slice(0, 2),
      "", "", "", "", "", "", "",
      amt, currency,
      "", "", "", "", "", "", "",
      "NON", "", reference(m), "EPD",
    ];
    return { kind: "swiss", data: lines.join("\r\n") };
  }
  if (currency !== "EUR") return null;
  const lines = ["BCD", "002", "1", "SCT", "", s.beneficiary.slice(0, 70), iban, amt ? `EUR${amt}` : "", "", "", reference(m).slice(0, 140)];
  return { kind: "sepa", data: lines.join("\n") };
}

export async function paymentQr(m: Member, s: Settings, amount: number) {
  const p = payload(m, s, amount);
  if (!p) return null;
  const svg = await QRCode.toString(p.data, { type: "svg", errorCorrectionLevel: "M", margin: 0, color: { dark: "#0f0f0f", light: "#ffffff" } });
  return { kind: p.kind, svg };
}
