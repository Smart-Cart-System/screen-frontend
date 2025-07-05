/**
 * Utility to generate password hashes for admin use
 * Run this in the browser console to generate hashes for new passwords
 */

export const generatePasswordHash = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// Console utility function
(window as any).generateAdminPasswordHash = async (password: string) => {
  try {
    const hash = await generatePasswordHash(password);
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
    console.log(`Copy this hash to ConfigScreen.tsx ADMIN_PASSWORD_HASH constant`);
    return hash;
  } catch (error) {
    console.error('Error generating hash:', error);
  }
};

// Example usage (for development only):
// In browser console, run: generateAdminPasswordHash('your-new-password')
