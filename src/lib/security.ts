import { NextRequest } from 'next/server';
import { randomBytes, timingSafeEqual } from 'crypto';

export class SecurityUtils {
  private static readonly CSRF_TOKEN_LENGTH = 32;
  private static readonly CSRF_COOKIE_NAME = 'csrf-token';
  private static readonly CSRF_HEADER_NAME = 'x-csrf-token';

  static generateCSRFToken(): string {
    return randomBytes(this.CSRF_TOKEN_LENGTH).toString('hex');
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
    return cleaned.length >= 10 && cleaned.length <= 15;
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
