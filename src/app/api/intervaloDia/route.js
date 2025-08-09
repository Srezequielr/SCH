import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function GET(request) {
  const cookieStore = await cookies();

  try {
    const registro_id = cookieStore.get("registro_id")?.value;

    let { data, error } = await supabase.rpc("intervalos_hoy_empleado", {
      id_reg: registro_id,
    });

    if (error) {
      return NextResponse.json(
        {
          error: "Error desconocido: " + error.message,
        },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      { intervalos: data },
      {
        status: 200,
      }
    );

    return response;
  } catch (err) {
    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 401 }
    );
  }
}
