"use client";
import Image from "next/image";
import Form from "@/atom/Form";
import { getEnv } from "@/lib/getEnvVar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const rememberCheckBox = () => {
    if (rememberMe) {
      localStorage.setItem("email", email);
    } else {
      localStorage.removeItem("email");
    }
  };

  const API_ROUTE = process.env.NEXT_PUBLIC_API_ROUTE_LOGIN!;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    rememberCheckBox();
    const response = await fetch(API_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok || data.error) {
      setError(data.error);
      throw new Error(data.error);
    } else if (response.ok && data.success) {
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between px-12 py-20 bg-black text-white overflow-hidden">
        <div></div>
        <div>
          <h1 className="text-5xl font-bold leading-tight mb-4">
            Sinch Creative Suite
          </h1>
          <p className="text-sm text-white/70 max-w-md">
            Sinch Demo engine and Creative Studio
          </p>
        </div>
        <Image
          src="/loginbackground.jpg"
          alt="login background"
          fill
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 border border-white rounded-xl m-8 pointer-events-none"></div>
      </div>

      <div className="flex items-center justify-center px-6 lg:px-20">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center">
            <Image
              src="/globe.svg"
              alt="Logo"
              width={30}
              height={30}
              className="mb-2"
            />
            <h2 className="text-2xl font-semibold">Sinch Demo Suite</h2>
            <p className="text-sm text-gray-500 text-center">
              Enter your email and password
            </p>
          </div>

          <Form onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black text-black"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black text-black"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="text-right mt-1">
                <a href="#" className="text-sm text-black hover:underline">
                  Forgot Password
                </a>
              </div>
            </div>

            <div className="min-h-[10px] mt-1">
              {password.length > 0 && password.length < 6 && (
                <p className="text-sm text-red-600">
                  Password must be at least 6 characters.
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="mr-2"
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember" className="text-sm">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            >
              Sign In
            </button>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
