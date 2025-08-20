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

  try {
    const intervalo_id = cookieStore.get("intervalo_id")?.value;

    let { data, error } = await supabase.rpc("marcar_salida", {
      intervalo_id,
    });

    if (error) {
      if (error.message === "409") {
        // Error de duplicado, ya existe un registro de entrada
        return NextResponse.json(
          {
            error: "Ya se ha registrado una entrada hoy, y no ha sido cerrada.",
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

    let { horas, errorHoras } = await supabase.rpc("acumular_horas", {
      horas_nuevas: data[0].horas_trabajadas.toFixed(2),
      id_reg: data[0].id_registro,
    });

    if (errorHoras) {
      return NextResponse.json(
        {
          error: "Error desconocido al actualizar horas: " + error.message,
        },
        { status: 500 }
      );
    }

    const response = NextResponse.json({ intervalo: data }, { status: 200 });

    response.cookies.set({
      name: "registro_id",
      value: data[0].id_registro,
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 12 * 60 * 60,
      sameSite: "strict",
    });

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
