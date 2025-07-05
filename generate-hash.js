#!/usr/bin/env node

/**
 * Generate SHA-256 hash for admin password
 * Usage: bunx generate-hash.js your-password
 */

const crypto = require('crypto');

const password = process.argv[2];

if (!password) {
  console.error('Usage: bunx generate-hash.js <password>');
  console.error('Example: bunx generate-hash.js admin123');
  process.exit(1);
}

const hash = crypto.createHash('sha256').update(password).digest('hex');

console.log('='.repeat(60));
console.log('🔐 Admin Password Hash Generator');
console.log('='.repeat(60));
console.log(`Password: ${password}`);
console.log(`Hash: ${hash}`);
console.log('='.repeat(60));
console.log('📋 Instructions:');
console.log('1. Copy the hash above');
console.log('2. Update ADMIN_PASSWORD_HASH in src/components/ConfigScreen.tsx');
console.log('3. Replace the existing hash with the new one');
console.log('='.repeat(60));
