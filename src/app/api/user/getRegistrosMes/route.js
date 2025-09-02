import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const clonedRequest = request.clone();
  const { mes } = await request.json();
  const { año } = await clonedRequest.json();

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.TOKEN)
    );
    const { dni } = payload;

    let { data, error } = await supabase.rpc("obt_reg_mes_emp", {
      a: año,
      dni_emp: dni,
      m: mes,
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
      { registros: data },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: "Token inválido o consulta fallida.",
      },
      { status: 409 }
    );
  }
}
