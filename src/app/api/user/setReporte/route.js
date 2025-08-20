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
  const { reporte } = await request.json();

  try {
    const registro_id = cookieStore.get("registro_id")?.value;

    // Ahora sí, consultar a Supabase con ese dni
    let { data, error } = await supabase.rpc("cargar_reporte", {
      id_reg: registro_id,
      reporte: reporte,
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
      { usuario: data },
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
