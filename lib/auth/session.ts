import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

/**
 * Hash a plain text password securely
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify plain text password against stored hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Role Constants & Verification Helpers
 */
export const ROLES = {
  CUSTOMER: Role.CUSTOMER,
  PROVIDER: Role.PROVIDER,
  ADMIN: Role.ADMIN,
} as const;

export function hasRole(userRole: Role | undefined | null, requiredRole: Role): boolean {
  if (!userRole) return false;
  if (userRole === Role.ADMIN) return true; // Admin superuser access
  return userRole === requiredRole;
}
