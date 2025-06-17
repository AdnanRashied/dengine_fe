import { NextRequest, NextResponse } from "next/server";
import { signJwt } from "@/lib/signjwt";

interface LoginPayload {
  email: string;
  password: string;
}

const parseLogin = async (req: NextRequest): Promise<LoginPayload> => {
  const data = await req.json().catch(() => null);
  if (!data?.email || !data?.password) {
    throw { status: 400, error: "Email and password are required" };
  }
  return {
    email: String(data.email).trim(),
    password: String(data.password),
  };
};

const validateLogin = ({ email, password }: LoginPayload): LoginPayload => {
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailReg.test(email)) {
    throw { status: 400, error: "Invalid email format" };
  }
  if (password.length < 6) {
    throw { status: 400, error: "Password must be at least 6 characters" };
  }
  return { email: email.trim(), password };
};

export const POST = async (req: NextRequest) => {
  try {
    const data = await parseLogin(req);
    const { email, password } = validateLogin(data);

    if (email === "test@gmail.com" && password === "password123") {
      const token = await signJwt({ sub: email, email, role: "user" }); // note `await`

      console.log("JWT token created from ROUTE:", token);

      const response = NextResponse.json({ success: true });

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60,
        path: "/",
        sameSite: "lax",
      });

      return response;
    } else {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.error || "Server error";
    return NextResponse.json({ error: message }, { status });
  }
};
