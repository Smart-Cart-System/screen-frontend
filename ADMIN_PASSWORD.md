# Admin Password System

## Overview
The Cart Configuration screen now requires admin authentication to prevent unauthorized access to cart setup.

## Current Admin Password
- **Password**: `omar`
- **Hash**: `21297e6e966afbd06e8f08c4525ae2edcbd3696cc6bc436037e278d4b1e67b4d`

## Changing the Admin Password

### Option 1: Using Browser Console (Recommended)
1. Open the application in your browser
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Run the following command:
   ```javascript
   generateAdminPasswordHash('your-new-password')
   ```
5. Copy the generated hash
6. Update the `ADMIN_PASSWORD_HASH` constant in `src/components/ConfigScreen.tsx`

### Option 2: Using Bun (bun)
1. Use the included script in the project root:
   ```bash
   bun generate-hash.js your-new-password
   ```
   Or alternatively, create a simple script file `generate-hash.js`:
   ```javascript
   const password = process.argv[2] || 'your-new-password';
   const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
   const hashArray = Array.from(new Uint8Array(hash));
   const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
   
   console.log(`Password: ${password}`);
   console.log(`Hash: ${hashHex}`);
   ```
2. Copy the generated hash
3. Update the `ADMIN_PASSWORD_HASH` constant in `src/components/ConfigScreen.tsx`

### Option 3: Using Node.js
1. Create a simple Node.js script:
   ```javascript
   const crypto = require('crypto');
   
   const password = 'your-new-password';
   const hash = crypto.createHash('sha256').update(password).digest('hex');
   console.log(`Password: ${password}`);
   console.log(`Hash: ${hash}`);
   ```
2. Run the script and copy the hash
3. Update the `ADMIN_PASSWORD_HASH` constant in `src/components/ConfigScreen.tsx`

## Security Features

### Web Crypto API
- Uses the browser's native Web Crypto API for secure hashing
- SHA-256 algorithm provides strong cryptographic security
- Client-side hashing (password never sent to server)

### Password Protection
- Cart ID setup requires admin authentication
- Invalid password attempts show generic error message
- Loading state prevents multiple rapid attempts
- Clear error messaging for admin users

## Usage
1. When no Cart ID is configured, the ConfigScreen appears
2. Admin must enter both password and Cart ID
3. Password is hashed using SHA-256 and compared to stored hash
4. On successful authentication, Cart ID is saved and app reloads

## UI Features
- Professional locked screen design
- Clear visual indication that admin access is required
- Error handling with user-friendly messages
- Loading states during authentication
- Responsive design for different screen sizes

## Development
The password hash generation utility is automatically loaded in development mode and provides the `generateAdminPasswordHash()` function in the browser console for easy hash generation.

## Quick Reference

### Generate New Password Hash
```bash
# Using bunx (recommended)
bunx generate-hash.js your-new-password

# Using browser console
generateAdminPasswordHash('your-new-password')
```

### Current Hash Location
File: `src/components/ConfigScreen.tsx`
Constant: `ADMIN_PASSWORD_HASH`

### Test Admin Access
1. Clear localStorage (Application tab in DevTools)
2. Refresh the page
3. Enter admin password and cart ID
4. Verify successful authentication
