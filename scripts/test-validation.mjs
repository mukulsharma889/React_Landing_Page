import { readFile } from 'node:fs/promises';
import { validateEmail, validateName } from '../src/validation.js';

const fixtureUrl = new URL('../tests/form-test-cases.json', import.meta.url);
const fixtures = JSON.parse(await readFile(fixtureUrl, 'utf8'));
let failures = 0;

fixtures.forEach((fixture) => {
  const nameResult = validateName(fixture.nameInput);
  const emailResult = validateEmail(fixture.emailInput);
  const passed = nameResult.isValid === fixture.nameValid
    && emailResult.isValid === fixture.emailValid
    && (!fixture.nameValid || nameResult.normalized === fixture.normalizedName)
    && (!fixture.emailValid || emailResult.normalized === fixture.normalizedEmail);

  if (!passed) failures += 1;
  console.log(`${fixture.id}: ${passed ? 'PASS' : 'FAIL'}`);
});

console.log(`\n${fixtures.length - failures}/${fixtures.length} fixtures passed.`);
if (failures > 0) process.exitCode = 1;
