import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function POST(request) {
  const clonedRequest = request.clone();
  const { id_empleado } = await request.json();
  const { sueldo } = await clonedRequest.json();

  try {
    // Ahora sí, consultar a Supabase con ese dni
    let { data, error } = await supabase.rpc("set_sueldo", {
      id_emp: id_empleado,
      sue: sueldo,
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
