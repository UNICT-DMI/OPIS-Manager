const fs = require('fs');
const path = require('path');

const MIN_COVERAGE = 60; // TODO: solo in fase di dev

const coverageFile = path.resolve(__dirname, '../coverage/opis-manager/coverage-final.json');

if(!fs.existsSync(coverageFile)) {
  console.error('Coverage file not found!');
  process.exit(1);
}

const coverageData = JSON.parse(fs.readFileSync(coverageFile, 'utf-8'));

let totalStatements = 0;
let coveredStatements = 0;

for(const file of Object.values(coverageData)) {
  const statement = file.s;
  if(!statement) continue;

  for(const hits of Object.values(statement)) {
    totalStatements++;
    if(hits > 0) coveredStatements++;
  }
}

if(totalStatements === 0) {
  console.error('No statements found in coverage!');
  process.exit(1);
}

const percentage = (coveredStatements / totalStatements) * 100;
const roundedPercentage = Number(percentage.toFixed(2));
console.log(`Coverage tests: ${roundedPercentage}%`);

if(roundedPercentage < MIN_COVERAGE) {
  console.error(`Coverage not valid, it has to be at least ${MIN_COVERAGE}%`);
  process.exit(1);
}

console.log('Valid coverage!');
process.exit(0);