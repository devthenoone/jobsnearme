import { db } from "./db";

// Keys the admin can manage from the dashboard.
export const SETTING_KEYS = [
  "adsense_pub_id",
  "rsoc_style_id",
  "show_keyword_preview",
] as const;

export type SettingKey = (typeof SETTING_KEYS)[number];

export function getSettings(): Record<string, string> {
  const rows = db.prepare("SELECT key, value FROM settings").all() as {
    key: string;
    value: string;
  }[];
  const out: Record<string, string> = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
}

export function setSettings(values: Record<string, string>): void {
  const up = db.prepare(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  );
  const tx = db.transaction((entries: [string, string][]) => {
    for (const [k, v] of entries) {
      if ((SETTING_KEYS as readonly string[]).includes(k)) up.run(k, v ?? "");
    }
  });
  tx(Object.entries(values));
}
