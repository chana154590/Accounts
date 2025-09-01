import fs from 'fs';
import path from 'path';

export function ensureDir(dirPath: string) {
  const resolved = path.resolve(dirPath);
  if (!fs.existsSync(resolved)) {
    fs.mkdirSync(resolved, { recursive: true });
  }
  return resolved;
}
