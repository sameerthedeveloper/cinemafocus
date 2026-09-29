#!/usr/bin/env node
/**
 * Create (or reset the password of) a Cognito login for the admin console or the owner portal.
 *
 *   node scripts/create-cognito-user.mjs --email owner@example.com --role owner
 *
 * Roles:  owner  read-only owner portal (/portal) — cannot sign in to /admin
 *         admin  full admin console (/admin) — cannot sign in to /portal
 *
 * The password is typed at a hidden prompt (never passed as an argument, never printed or logged).
 * Uses your local AWS CLI credentials and COGNITO_POOL_ID / AWS_REGION from .env.local.
 * Needs the AWS SDK from infra/:  cd infra && npm ci
 */
import fs from 'node:fs';
import readline from 'node:readline';
import { createRequire } from 'node:module';

if (fs.existsSync('.env.local')) process.loadEnvFile('.env.local');

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const email = opt('email');
const role = opt('role') || 'owner';
const poolId = process.env.COGNITO_POOL_ID;
const region = process.env.AWS_REGION || 'ap-south-1';

const fail = (m) => { console.error(m); process.exit(2); };
if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) fail('Usage: node scripts/create-cognito-user.mjs --email you@example.com --role owner|admin');
if (!['owner', 'admin'].includes(role)) fail('--role must be "owner" or "admin"');
if (!poolId) fail('COGNITO_POOL_ID is not set (put it in .env.local)');

let sdk;
try {
  sdk = createRequire(new URL('../infra/package.json', import.meta.url))('@aws-sdk/client-cognito-identity-provider');
} catch {
  fail('AWS SDK not found. Run:  cd infra && npm ci');
}

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.includes(question)) rl.output.write(s); else rl.output.write(''); };
    rl.question(question, (answer) => { rl.output.write('\n'); rl.close(); resolve(answer); });
  });
}

const password = await askHidden('New password (min 8 chars, upper/lower/number): ');
const confirm = await askHidden('Repeat password: ');
if (password !== confirm) fail('Passwords do not match.');
if (password.length < 8) fail('Password must be at least 8 characters.');

const client = new sdk.CognitoIdentityProviderClient({ region });
const attrs = [
  { Name: 'email', Value: email },
  { Name: 'email_verified', Value: 'true' },
  { Name: 'custom:role', Value: role },
];

try {
  try {
    await client.send(new sdk.AdminCreateUserCommand({ UserPoolId: poolId, Username: email, UserAttributes: attrs, MessageAction: 'SUPPRESS' }));
    console.log(`Created ${role} user ${email}`);
  } catch (e) {
    if (e.name !== 'UsernameExistsException') throw e;
    // Existing user: make sure the role is what was asked for, then reset the password below.
    await client.send(new sdk.AdminUpdateUserAttributesCommand({ UserPoolId: poolId, Username: email, UserAttributes: [{ Name: 'custom:role', Value: role }] }));
    console.log(`User ${email} already exists; role set to ${role}`);
  }
  await client.send(new sdk.AdminSetUserPasswordCommand({ UserPoolId: poolId, Username: email, Password: password, Permanent: true }));
  console.log('Password set. Sign in at ' + (role === 'admin' ? '/admin/login' : '/portal/login') + '.');
} catch (e) {
  console.error(`Failed: ${e.name}: ${e.message}`);
  process.exit(1);
}
