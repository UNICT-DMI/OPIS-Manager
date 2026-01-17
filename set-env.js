const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, './.env') });

const envFilePath = path.resolve(__dirname, './src/enviroment.ts');
const output = `export const env = {
  api_url: "https://api-opis.unictdev.org/api/v2"
};`;
fs.writeFileSync(envFilePath, output);

console.log('File created successfully!');