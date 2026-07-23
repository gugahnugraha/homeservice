import bcrypt from 'bcryptjs';

/**
 * Hash a plain text password securely
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify plain text password against stored hash
 */
export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Role Constants & Verification Helpers
 */
export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  PROVIDER: 'PROVIDER',
  ADMIN: 'ADMIN',
};

export function hasRole(userRole, requiredRole) {
  if (!userRole) return false;
  if (userRole === ROLES.ADMIN) return true; // Admin has super-access
  return userRole === requiredRole;
}
