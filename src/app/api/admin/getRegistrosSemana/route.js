import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function POST(request) {
  const clonedRequest = request.clone();
  const { semana } = await request.json();
  const { dni_empleado } = await clonedRequest.json();

  try {
    let { data, error } = await supabase.rpc("obt_reg_sem_emp", {
      dni_emp: dni_empleado,
      sem: semana,
    });

    if (error) {
      return NextResponse.json(
        {
          error: "Error desconocido: " + error.message,
        },
        { status: 500 }
      );
    }

    const response = NextResponse.json({ registro: data }, { status: 200 });

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
