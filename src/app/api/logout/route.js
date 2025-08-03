import { cookies } from "next/headers";

export async function POST() {
  cookies().set({
    name: "session_token",
    value: "",
    maxAge: 0, // borra la cookie
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
