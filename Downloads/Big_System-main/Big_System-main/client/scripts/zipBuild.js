const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const buildDir = path.resolve(__dirname, '..', 'build');
const outZip = path.resolve(__dirname, '..', 'clean_deploy.zip');

// Remove existing zip if any
if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

const output = fs.createWriteStream(outZip);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', function () {
  console.log(archive.pointer() + ' total bytes');
  console.log('clean_deploy.zip has been created');
});

archive.on('warning', function (err) {
  if (err.code === 'ENOENT') console.warn(err);
  else throw err;
});

archive.on('error', function (err) {
  throw err;
});

archive.pipe(output);

// Exclude .map files explicitly
archive.glob('**/*', {
  cwd: buildDir,
  ignore: ['**/*.map']
});

archive.finalize();