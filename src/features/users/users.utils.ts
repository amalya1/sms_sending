import bcrypt from 'bcrypt';
import crypto from 'crypto';


export function randomInvitationCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

export async function protectPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, currentPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, currentPassword);
}
