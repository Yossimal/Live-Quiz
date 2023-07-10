import { scryptSync, randomBytes } from 'crypto';

export function hasePassword(password: string) {
    const salt = randomBytes(8).toString('hex');
    const hash = scryptSync(password, salt, 32) as Buffer;
    return `${salt}:${hash.toString('hex')}`;
}

export function verifyPassword(password: string, hash: string) {
    const [salt, key] = hash.split(':');
    const buffer = scryptSync(password, salt, 32) as Buffer;
    return buffer.toString('hex') === key;
}