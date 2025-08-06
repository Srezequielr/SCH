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

    let { data, error } = await supabase.rpc("obt_empleados", {
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
      { empleados: data },
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
