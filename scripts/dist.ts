import fs from 'node:fs';

fs.copyFileSync('./.npmignore', './dist/.npmignore');
fs.copyFileSync('./LICENSE', './dist/LICENSE');

const packageJson = {
  ...JSON.parse(fs.readFileSync('package.json', 'utf-8')),
  module: 'index.js',
  types: 'index.d.ts',
  exports: {
    '.': {
      import: './index.js',
      require: './index.js',
    },
  },
};

delete packageJson.devDependencies;
delete packageJson.scripts;

fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 2), 'utf-8');