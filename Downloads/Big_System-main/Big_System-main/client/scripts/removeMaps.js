const fs = require('fs').promises;
const path = require('path');

async function removeMaps(dir) {
  let removed = 0;
  async function walk(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(current, ent.name);
      if (ent.isDirectory()) await walk(full);
      else if (ent.isFile() && full.endsWith('.map')) {
        await fs.unlink(full);
        console.log('Removed:', path.relative(process.cwd(), full));
        removed++;
      }
    }
  }

  try {
    await walk(dir);
    console.log(`Done. Removed ${removed} .map file(s).`);
  } catch (err) {
    console.error('Error while removing .map files:', err);
    process.exit(1);
  }
}

const buildDir = path.resolve(__dirname, '..', 'build');
removeMaps(buildDir);