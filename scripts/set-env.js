const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const envFilePath = path.resolve(__dirname, '../src/environment.ts');
const output = `export const env = {
  api_url: "https://api-opis.unictdev.org/api/v2",
  github_api_url: "https://api.github.com/repos/UNICT-DMI"
};`;
fs.writeFileSync(envFilePath, output);

console.log('File created successfully!');