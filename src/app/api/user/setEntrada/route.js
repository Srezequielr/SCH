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

  const { lat, long } = await request.json();

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.TOKEN)
    );
    const { dni } = payload;
    
    let { data, error } = await supabase.rpc("marcar_entrada", {
      dni_emp: dni,
      lat,
      long,
    });

    if (error) {
      if (error.message === "409") {
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

    response.cookies.set({
      name: "intervalo_id",
      value: data,
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
