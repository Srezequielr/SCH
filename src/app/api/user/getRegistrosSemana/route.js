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
  const { semana } = await request.json();

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.TOKEN)
    );

    const { dni } = payload; // ← el dni que guardaste al loguear
    

    let { data, error } = await supabase.rpc("obt_reg_sem_emp", {
      dni_emp: dni,
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
