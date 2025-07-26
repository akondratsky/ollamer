import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';

copyFileSync('./.npmignore', './dist/.npmignore');
copyFileSync('./LICENSE', './dist/LICENSE');
copyFileSync('./README.md', './dist/README.md');

const packageJson = {
  ...JSON.parse(readFileSync('package.json', 'utf-8')),
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

writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 2), 'utf-8');
