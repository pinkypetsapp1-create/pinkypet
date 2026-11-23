import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Carga backend/.env si existe, sin pisar variables ya definidas. (Sin dependencias.) */
export function loadDotEnv(file = join(__dirname, '..', '.env')): void {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (m && !line.trimStart().startsWith('#') && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
