import { handlers } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import { authRateLimit, clearLocalhostRateLimits } from "@/lib/rate-limiter";
import { SecurityUtils } from "@/lib/security";

// Clear localhost rate limits on module load
clearLocalhostRateLimits();

async function withRateLimitAndCSRF(request: Request | NextRequest, handler: () => Promise<Response>) {
  const req = request as NextRequest;
  
  // Skip rate limiting for session, signout, and csrf requests to prevent 429 errors
  const isSessionRequest = req.url.includes('session') || req.url.includes('csrf');
  const isSignoutRequest = req.url.includes('signout') || req.method === 'DELETE';
  const skipRateLimit = isSessionRequest || isSignoutRequest;
  
  if (!skipRateLimit) {
    // Rate limiting
    const rateLimitResult = authRateLimit.check(req);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime?.toString() || '',
          }
        }
      );
    }
  }

  // CSRF protection for POST requests (skip for signout and session)
  if (req.method === 'POST' && !isSignoutRequest && !isSessionRequest) {
    if (!SecurityUtils.validateCSRFToken(req)) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }
  }

  const response = await handler();
  
  // Add rate limit headers (skip for session and signout)
  if (!skipRateLimit) {
    const rateLimitResult = authRateLimit.check(req);
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining?.toString() || '0');
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime?.toString() || '');
  }
  
  return response;
}

export const GET = (req: NextRequest) => withRateLimitAndCSRF(req, () => handlers.GET(req));
export const POST = (req: NextRequest) => withRateLimitAndCSRF(req, () => handlers.POST(req));
