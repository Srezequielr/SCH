import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.TOKEN);

export async function middleware(req) {
  const token = req.cookies.get("session_token")?.value;
  
  const loginPath = "/";

  if (!token && req.nextUrl.pathname !== loginPath) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token) {
    try {
      await jwtVerify(token, SECRET_KEY);
      return NextResponse.next();
    } catch (e) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// Definimos qué rutas proteger
export const config = {
  matcher: ["/dashboard/:path*"], // protege todas las subrutas
};
