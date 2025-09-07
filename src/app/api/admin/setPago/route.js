import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function POST(request) {
  const clonedRequest = request.clone();
  const { id_empleado } = await request.json();
  const { pago, num_sem } = await clonedRequest.json();

  try {
    let { data, error } = await supabase.rpc("agregar_pago_chequera", {
      monto: pago,
      p_id_empleado: id_empleado,
      p_num_semana: num_sem,
    });

    if (error) {
      if (error.message === "409") {
        // Error de duplicado, ya existe un registro de entrada
        return NextResponse.json(
          {
            error: "El monto del pago excede el balance disponible.",
          },
          { status: 409 }
        );
      }
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
