import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function POST(request) {
  const { id_empleado } = await request.json();

  try {
    let { data, error } = await supabase.rpc("obt_ult_chequera", {
      id_emp: id_empleado,
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
      { balance: data },
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
