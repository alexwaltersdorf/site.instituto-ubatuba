/**
 * Fix esbuild binary permissions (EACCES error on Hostinger/shared hosting)
 * 
 * When pnpm installs packages with ignored build scripts (pnpm v10+),
 * the esbuild native binary doesn't get chmod +x applied via postinstall.
 * This script recursively finds all esbuild binaries in node_modules
 * and ensures they have execute permission.
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const nodeModules = path.resolve(__dirname, '..', 'node_modules');

try {
  // Use find command to locate all esbuild binaries and chmod them
  execSync(
    `find "${nodeModules}" -name "esbuild" -path "*/bin/esbuild" -type f -exec chmod +x {} +`,
    { stdio: 'pipe' }
  );
  console.log('✓ esbuild binary permissions fixed');
} catch (e) {
  // Fallback: manually walk known paths
  const pnpmDir = path.join(nodeModules, '.pnpm');
  let fixed = 0;
  
  try {
    const entries = fs.readdirSync(pnpmDir);
    for (const entry of entries) {
      // Match patterns like @esbuild+linux-x64@0.25.10 and esbuild@0.25.10
      if (entry.includes('esbuild')) {
        const entryPath = path.join(pnpmDir, entry);
        const walkBins = (dir) => {
          try {
            const items = fs.readdirSync(dir, { withFileTypes: true });
            for (const item of items) {
              const fullPath = path.join(dir, item.name);
              if (item.isDirectory()) {
                walkBins(fullPath);
              } else if (item.name === 'esbuild' && dir.endsWith('/bin')) {
                try {
                  fs.chmodSync(fullPath, 0o755);
                  fixed++;
                } catch (err) {}
              }
            }
          } catch (err) {}
        };
        walkBins(entryPath);
      }
    }
  } catch (err) {}
  
  console.log(`✓ esbuild binary permissions fixed (fallback: ${fixed} binaries)`);
}
