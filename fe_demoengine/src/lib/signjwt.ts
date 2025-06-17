import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { getEnv } from "@/lib/getEnvVar";

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
  role?: "user" | "admin";
  [key: string]: unknown; // index signature for Type-safe
}

export class JwtVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JwtVerificationError";
  }
}

const JWT_SECRET = new TextEncoder().encode(getEnv("JWT_SECRET"));
const JWT_EXPIRE_SECONDS = 15 * 60; // 15 minutes

export const signJwt = async (payload: JwtPayload): Promise<string> => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${JWT_EXPIRE_SECONDS}s`)
    .sign(JWT_SECRET);
};

export const verifyJwt = async (token: string): Promise<JwtPayload> => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      throw new JwtVerificationError("Missing required JWT fields");
    }

    return {
      sub: payload.sub,
      email: payload.email,
      iat: payload.iat,
      exp: payload.exp,
      role: payload.role === "admin" ? "admin" : "user",
    };
  } catch (err) {
    console.error("JWT verification error (jose):", err);
    throw new JwtVerificationError("Invalid or expired token");
  }
};
