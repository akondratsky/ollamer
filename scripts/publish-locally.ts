import clipboardy from 'clipboardy-ts';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync('package.json', 'utf-8')) as { version: string; name: string; };

// 0.0.1-beta.1
const [base, suffix] = packageJson.version.split('-');
const [_, localVersion] = suffix?.split('.') ?? [];
packageJson.version = `${base}-beta.${localVersion ? parseInt(localVersion, 10) + 1 : 1}`;

writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');

execSync('bun run build', { stdio: 'inherit' });
execSync('npm publish ./dist --registry http://localhost:4873', { stdio: 'inherit' });

const packageLabel = `${packageJson.name}@${packageJson.version}`;
const command = `bun add ${packageLabel} --registry http://localhost:4873 -E`;

clipboardy.writeSync(command);

console.log(`
Published ${packageLabel} to local registry

Copied command to clipboard:
"${command}"
`);
