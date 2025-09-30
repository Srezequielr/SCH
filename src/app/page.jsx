"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ documento: event.target.dni.value }),
    });
    const data = await res.json();
    setIsLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }

    if (!data.usuario.dni) {
      setError("DNI no encontrado");
      return;
    } else {
      if (data.usuario.super_admin) {
        router.push("dashboard/admin");
      } else {
        router.push("dashboard/user");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 px-5">
      <p className="absolute top-2 right-2">V1.10.13.4</p>
      <Image
        width={250}
        height={250}
        alt="Aguilana Icono Negro"
        src="/aguilanaIsoNegro.png"
      />
      <h1 className="font-title text-center text-4xl">
        Sistema de Control Horario
      </h1>
      <div className="font-body bg-brown-main rounded-2xl p-5 text-center text-lg">
        <form onSubmit={handleSubmit}>
          <label className="font-body text-2xl">Ingrese su DNI</label>
          <input
            type="number"
            className="border-brown-detail focus:outline-brown-detail bg-background my-2 w-full rounded-lg border p-2 transition focus:outline-4 focus:outline-offset-2 focus:outline-solid"
            placeholder="DNI"
            name="dni"
            required
          />

          <button type="submit" className="button_1">
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
      {error && (
        <p className="px-5 text-center font-bold text-red-500 transition-all">
          {error}
        </p>
      )}
    </div>
  );
}
