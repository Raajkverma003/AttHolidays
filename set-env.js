const fs = require('fs');
const path = require('path');

// Load environment variables from root .env file if present
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const dir = path.join(__dirname, 'src/environments');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const targetPath = path.join(dir, 'environment.ts');
const targetDevPath = path.join(dir, 'environment.development.ts');

let apiUrl = process.env.API_URL;
if (!apiUrl && process.env.VERCEL_URL) {
  apiUrl = `https://${process.env.VERCEL_URL}/api`;
}
if (!apiUrl) {
  apiUrl = 'http://localhost:5001/api';
}
if (apiUrl.endsWith('/')) {
  apiUrl = apiUrl.slice(0, -1);
}

const envConfigFile = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}'
};
`;

const devEnvConfigFile = `export const environment = {
  production: false,
  apiUrl: '${apiUrl}'
};
`;

console.log(`Generating environment files with API_URL: ${apiUrl}`);
fs.writeFileSync(targetPath, envConfigFile);
fs.writeFileSync(targetDevPath, devEnvConfigFile);
