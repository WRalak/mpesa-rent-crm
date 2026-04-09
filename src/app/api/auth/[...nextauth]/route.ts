import { handlers } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import { authRateLimit } from "@/lib/rate-limiter";
import { SecurityUtils } from "@/lib/security";

async function withRateLimitAndCSRF(request: Request | NextRequest, handler: () => Promise<Response>) {
  const req = request as NextRequest;
  
  // Rate limiting
  const rateLimitResult = authRateLimit.check(req);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime?.toString() || '',
        }
      }
    );
  }

  // CSRF protection for POST requests
  if (req.method === 'POST') {
    if (!SecurityUtils.validateCSRFToken(req)) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }
  }

  const response = await handler();
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', '5');
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining?.toString() || '0');
  response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime?.toString() || '');
  
  return response;
}

export const GET = (req: NextRequest) => withRateLimitAndCSRF(req, () => handlers.GET(req));
export const POST = (req: NextRequest) => withRateLimitAndCSRF(req, () => handlers.POST(req));
