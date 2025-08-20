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
    <div className="flex flex-col items-center justify-center min-h-screen gap-10">
      <p className="absolute right-2 top-2">V1.2.3</p>
      <Image
        width={250}
        height={250}
        alt="Aguilana Icono Negro"
        src="/aguilanaIsoNegro.png"
      />
      <h1 className="font-title text-4xl text-center">
        Sistema de Control de Horarios
      </h1>
      <div className="font-body text-center text-lg  bg-brown-main w-5/6 p-5 rounded-2xl">
        <form onSubmit={handleSubmit}>
          <label className="font-body text-2xl">Ingrese su DNI</label>
          <input
            type="number"
            className="w-full p-2 mt-2 border border-brown-detail rounded-lg focus:outline-solid focus:outline-offset-2 focus:outline-4 focus:outline-brown-detail bg-background transition"
            placeholder="DNI"
            name="dni"
            required
          />

          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-brown-detail text-white rounded-lg focus:outline-solid focus:outline-offset-2 focus:outline-4 focus:outline-brown-detail transition"
          >
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
      {error && (
        <p className="text-red-500 font-bold text-center px-5 transition-all">{error}</p>
      )}
    </div>
  );
}
