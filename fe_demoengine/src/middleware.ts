import { NextRequest, NextResponse } from "next/server";
import { verifyJwt, JwtVerificationError } from "@/lib/signjwt";

export class MiddlewareError extends Error {
  statusCode: number;
  cause?: unknown;
  constructor(message: string, statusCode = 500, cause?: unknown) {
    super(message);
    this.name = "MiddlewareError";
    this.statusCode = statusCode;
    this.cause = cause;
    Object.setPrototypeOf(this, MiddlewareError.prototype);
  }
}

const extractTokenFromCookie = (req: NextRequest): string | null => {
  const token = req.cookies.get("token")?.value || null;
  if (!token) {
    console.log("No token found in cookies.");
  }
  return token;
};

export const middleware = async (req: NextRequest) => {
  const token = extractTokenFromCookie(req);

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    await verifyJwt(token);
    return NextResponse.next();
  } catch (err) {
    if (err instanceof JwtVerificationError) {
      console.warn("JWT verification failed:", err.message);
    } else {
      console.error("Unexpected middleware error:", err);
    }
    return NextResponse.redirect(new URL("/", req.url));
  }
};

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
