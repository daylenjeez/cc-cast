import { homedir } from "os";
import { join } from "path";
import { existsSync, readFileSync, writeFileSync, renameSync, unlinkSync } from "fs";

const SETTINGS_PATH = join(homedir(), ".claude", "settings.json");

export function readClaudeSettings(): Record<string, unknown> {
  if (!existsSync(SETTINGS_PATH)) return {};
  return JSON.parse(readFileSync(SETTINGS_PATH, "utf-8"));
}

// Recursively sort object keys for deterministic serialization (matches cc-switch behavior)
function sortKeys(obj: unknown): unknown {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sortKeys);

  const sorted: Record<string, unknown> = {};
  const keys = Object.keys(obj as Record<string, unknown>).sort();
  for (const key of keys) {
    sorted[key] = sortKeys((obj as Record<string, unknown>)[key]);
  }
  return sorted;
}

// Sanitize settings before writing (remove cc-switch internal fields)
function sanitizeSettings(settings: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...settings };
  // cc-switch meta field
  delete sanitized.currentProviderClaude;
  // cc-switch internal-only fields (matches sanitize_claude_settings_for_live in cc-switch)
  delete sanitized.api_format;
  delete sanitized.apiFormat;
  delete sanitized.openrouter_compat_mode;
  delete sanitized.openrouterCompatMode;
  return sanitized;
}

export function applyProfile(_name: string, settingsConfig: Record<string, unknown>): void {
  const current = readClaudeSettings();

  // 保留用户级字段，用 profile 的配置覆盖
  const preserved: Record<string, unknown> = {};
  const USER_FIELDS = ["language", "permissions"];
  for (const key of USER_FIELDS) {
    if (key in current) {
      preserved[key] = current[key];
    }
  }

  // Merge instead of replace: keep any top-level keys from the existing file
  // that the profile does not explicitly set (e.g. common snippets from cc-switch)
  let merged = { ...current, ...preserved, ...settingsConfig };

  // Sanitize and sort keys to match cc-switch behavior
  merged = sanitizeSettings(merged);
  const sorted = sortKeys(merged) as Record<string, unknown>;

  // Atomic write: write to temp file, then rename (matches cc-switch's atomic_write)
  const tmpPath = `${SETTINGS_PATH}.tmp.${Date.now()}`;
  try {
    writeFileSync(tmpPath, JSON.stringify(sorted, null, 2));

    // On Windows, remove target first if it exists
    if (process.platform === "win32" && existsSync(SETTINGS_PATH)) {
      unlinkSync(SETTINGS_PATH);
    }

    renameSync(tmpPath, SETTINGS_PATH);
  } catch (error) {
    // Clean up temp file on error
    if (existsSync(tmpPath)) {
      try { unlinkSync(tmpPath); } catch { /* ignore */ }
    }
    throw error;
  }
}

export function getSettingsPath(): string {
  return SETTINGS_PATH;
}
