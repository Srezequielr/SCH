import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function POST(request) {
  const { documento } = await request.json();

  let { data, error } = await supabase.rpc("login", {
    dni_emp: documento,
  });

  if (error || !data) {
    return NextResponse.json(
      {
        error:
          "Ocurrio un error al iniciar sesión, intente más tarde. Si el problema persiste contacte al administrador",
      },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    {
      id_empleado: data.id_empleado,
      dni: data.dni,
    },
    process.env.TOKEN,
    { expiresIn: "1d" }
  );

  const cookieStore = await cookies();

  cookieStore.set({
    name: "session_token",
    value: token,
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 10 * 60 * 60,
    sameSite: "strict",
  });

  return NextResponse.json({ usuario: data }, { status: 200 });
}
