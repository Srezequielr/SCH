import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.TOKEN)
    );

    const { dni } = payload; // ← el dni que guardaste al loguear

    let { data, error } = await supabase.rpc("obt_ultimo_reg", {
      dni_emp: dni,
    });

    if (error) {
      return NextResponse.json(
        {
          error: "Error desconocido: " + error.message,
        },
        { status: 500 }
      );
    }

    const response = NextResponse.json({ registro: data[0] }, { status: 200 });

    if (data[0]) {
      response.cookies.set({
        name: "registro_id",
        value: data[0].id,
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 12 * 60 * 60,
        sameSite: "strict",
      });
    }

    return response;
  } catch (err) {
    return NextResponse.json(
      {
        error: "Error desconocido: " + err.message,
      },
      { status: 409 }
    );
  }
}
