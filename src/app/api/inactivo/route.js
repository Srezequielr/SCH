import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function GET(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.TOKEN)
    );
    const { dni } = payload; // ← el dni que guardaste al loguear

    // Ahora sí, consultar a Supabase con ese dni
    let { data, error } = await supabase.rpc("set_inactivo", {
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

    return NextResponse.json(
      { cookie: payload, usuario: data },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 401 }
    );
  }
}
