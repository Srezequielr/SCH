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

  const intervalo_id = cookieStore.get("intervalo_id")?.value;

  try {
    let { data, error } = await supabase.rpc("marcar_entrada", {
      marcar_salida: intervalo_id,
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

    const response = NextResponse.json(
      { cookie: payload, usuario: data },
      { status: 200 }
    );

    return response;
    // Aca va toda la logida de la ruta de marcar salida
    // Deveria ser similar a la de entrada
    // Pero con la diferencia que tengo que calcular la cantidad de horas trabajadas obtiendo la hora de entrada del intervalo completo
  } catch (err) {
    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 401 }
    );
  }
}
