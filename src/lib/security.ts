import { NextRequest } from "next/server";

// Use Web Crypto API for Edge Runtime compatibility
const randomBytes = (length: number): Uint8Array => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint8Array(length));
  }
  // Fallback if crypto is not available
  const array = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    array[i] = Math.floor(Math.random() * 256);
  }
  return array;
};

const timingSafeEqual = (a: Buffer | Uint8Array, b: Buffer | Uint8Array): boolean => {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
};

export class SecurityUtils {
  private static readonly CSRF_TOKEN_LENGTH = 32;
  private static readonly CSRF_COOKIE_NAME = 'csrf-token';
  private static readonly CSRF_HEADER_NAME = 'x-csrf-token';

  static generateCSRFToken(): string {
    const bytes = randomBytes(this.CSRF_TOKEN_LENGTH);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static validateCSRFToken(request: NextRequest): boolean {
    const cookieToken = request.cookies.get(this.CSRF_COOKIE_NAME)?.value;
    const headerToken = request.headers.get(this.CSRF_HEADER_NAME);

    if (!cookieToken || !headerToken) {
      return false;
    }

    // Use timing-safe comparison to prevent timing attacks
    try {
      const cookieBuffer = Buffer.from(cookieToken, 'hex');
      const headerBuffer = Buffer.from(headerToken, 'hex');
      
      if (cookieBuffer.length !== headerBuffer.length) {
        return false;
      }

      return timingSafeEqual(cookieBuffer, headerBuffer);
    } catch {
      return false;
    }
  }

  static setCSRFCookie(response: Response, token: string): void {
    response.headers.set(
      'Set-Cookie',
      `${this.CSRF_COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`
    );
  }

  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  }

  static validatePhoneNumber(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 5 && cleaned.length <= 20;
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isSecureOrigin(request: NextRequest): boolean {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    if (!origin || !host) return false;
    
    try {
      const originUrl = new URL(origin);
      return originUrl.hostname === host;
    } catch {
      return false;
    }
  }
}
