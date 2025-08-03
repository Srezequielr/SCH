"use client";

import { useEffect, useState } from "react";

export default function PanelTrabajo({ userData }) {
  const [disabledEntrada, setDisabledEntrada] = useState(false);
  const [disabledSalida, setDisabledSalida] = useState(false);

  useEffect(() => {
    if (userData && userData.usuario && userData.usuario.estado == "Activo") {
      setDisabledEntrada(true);
      setDisabledSalida(false);
    } else {
      setDisabledEntrada(false);
      setDisabledSalida(true);
    }
  }, [userData]);

  const entrada = async () => {
    console.log("Marcar entrada...");
    const res = await fetch("/api/entrada");
    if (!res.ok) {
      const error = await res.json();
      alert(error.error);
      return;
    }
    const estado = await fetch("/api/activo");
    if (!estado.ok) {
      const error = await estado.json();
      alert(error.error);
      return;
    }
    alert("Entrada marcada correctamente.");
  };

  const salida = async () => {
    console.log("Marcar salida...");
    const res = await fetch("/api/salida");
    if (!res.ok) {
      const error = await res.json();
      alert(error.error);
      return;
    }
    const estado = await fetch("/api/inactivo");
    if (!estado.ok) {
      const error = await estado.json();
      alert(error.error);
      return;
    }
    alert("Salida marcada correctamente.");
  };

  return (
    <div className="bg-brown-main p-5 text-center rounded-2xl w-full">
      <h2 className="font-body text-3xl">Panel de trabajo</h2>
      {userData.usuario.estado === "Activo" ? (
        <p className="bg-brown-detail text-green-400 text-center font-bold text-4xl p-3 rounded-2xl my-2">
          {userData.usuario.estado}
        </p>
      ) : (
        <p className="bg-brown-detail text-red-400 text-center font-bold text-4xl p-3 rounded-2xl my-2">
          {userData.usuario.estado}
        </p>
      )}
      <p className="font-body text-lg py-2">
        Esta es la sección de usuario, aquí podrás ver tus horarios y realizar
        otras acciones.
      </p>
      <div className="flex flex-col gap-2 mb-4">
        <button
          onClick={entrada}
          className="bg-brown-detail text-white font-bold py-2 px-4 rounded-2xl disabled:text-gray-400"
          disabled={disabledEntrada}
        >
          Marcar entrada
        </button>
        <button
          onClick={salida}
          className="bg-brown-detail text-white font-bold py-2 px-4 rounded-2xl disabled:text-gray-400"
          disabled={disabledSalida}
        >
          Marcar salida
        </button>
      </div>
    </div>
  );
}
