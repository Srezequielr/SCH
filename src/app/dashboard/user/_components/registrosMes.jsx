"use client";

import { useState } from "react";
import formatHorasTrabajo from "@/utils/formatHsTrabajo";

export default function RegistrosMes() {
  const [loading, setLoading] = useState(false);

  const [registrosData, setRegistrosData] = useState(null);
  const handlerSearch = async (event) => {
    setLoading(true);
    event.preventDefault();
    const mes = event.target.mes.value;
    const año = event.target.año.value;
    const res = await fetch("/api/user/getRegistrosMes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mes: mes, año: año }),
    });
    const registrosData = await res.json();
    setRegistrosData(registrosData.registros);
    setLoading(false);
  };
  return (
    <div className="bg-brown-main w-full rounded-2xl p-5 text-center">
      <form action="" onSubmit={handlerSearch}>
        <div className="flex flex-row">
          <input
            type="text"
            placeholder="Mes"
            name="mes"
            required
            className="bg-background focus:outline-brown-detail mb-2 w-full rounded-l-2xl p-2 text-center focus:outline-4 focus:outline-offset-2 focus:outline-solid"
          />
          <input
            type="text"
            placeholder="Año"
            name="año"
            required
            className="bg-background focus:outline-brown-detail mb-2 w-full rounded-r-2xl p-2 text-center focus:outline-4 focus:outline-offset-2 focus:outline-solid"
          />
        </div>
        <button className="button_2">
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>
      <div className="bg-background mt-2 flex w-full flex-col gap-2 rounded-2xl p-2">
        {registrosData && registrosData.length > 0 ? (
          registrosData.map((registro, index) => {
            return (
              <div className="bg-brown-main rounded-2xl p-2" key={index}>
                <div className="bg-brown-main flex flex-row justify-between gap-2 rounded-2xl p-2">
                  <p className="font-body text-right text-lg">
                    Horas trabajadas:{" "}
                    <span className="font-bold">
                      {formatHorasTrabajo(registro.horas)}
                    </span>
                  </p>
                  <p className="font-body text-right text-lg">
                    <span className="font-bold">{registro.fecha}</span>
                  </p>
                </div>
                <hr />
                <h2 className="font-body my-2 text-center">Reporte del dia</h2>
                <p className="font-body bg-background my-2 w-full rounded-2xl p-2 text-center whitespace-pre-line">
                  {registro.informe
                    ? registro.informe
                    : "No hay un informe cargado."}
                </p>
              </div>
            );
          })
        ) : (
          <p className="font-body py-2 text-lg">
            {registrosData && registrosData.length === 0
              ? "No hay registros en esa fecha."
              : "Por favor, seleccione un mes y año para mostrar contenido."}
          </p>
        )}
      </div>
    </div>
  );
}
