"use client";

import { useState } from "react";

function formatHorasTrabajo(horasDecimales) {
  if (horasDecimales === null || horasDecimales === undefined) {
    return "--:--";
  }

  const horas = Math.floor(horasDecimales);
  const minutos = Math.round((horasDecimales - horas) * 60);

  return `${horas.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}`;
}

export default function RegistrosMes({ dni }) {
  const [loading, setLoading] = useState(false);

  const [registrosData, setRegistrosData] = useState(null);
  const handlerSearch = async (event) => {
    setLoading(true);
    event.preventDefault();
    const mes = event.target.mes.value;
    const año = event.target.año.value;
    const res = await fetch("/api/admin/getRegistrosMes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dni: dni, mes: mes, año: año }),
    });
    const registrosData = await res.json();
    setRegistrosData(registrosData.registros);
    setLoading(false);
  };
  return (
    <div className="bg-brown-main p-5 text-center rounded-2xl w-full">
      <form action="" onSubmit={handlerSearch}>
        <div className="flex flex-row ">
          <input
            type="text"
            placeholder="Mes"
            name="mes"
            required
            className="bg-background p-2 rounded-l-2xl w-full my-2 focus:outline-solid focus:outline-offset-2 focus:outline-4 focus:outline-brown-detail text-center"
          />
          <input
            type="text"
            placeholder="Año"
            name="año"
            required
            className="bg-background p-2 rounded-r-2xl w-full my-2 focus:outline-solid focus:outline-offset-2 focus:outline-4 focus:outline-brown-detail text-center"
          />
        </div>
        <button className="bg-brown-detail text-white font-bold w-full py-2 px-4 rounded-2xl disabled:text-gray-400 focus:outline-solid focus:outline-offset-2 focus:outline-4 focus:outline-brown-detail">
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>
      <div className="bg-background flex flex-col gap-2 p-2 w-full my-2 rounded-2xl">
        {registrosData && registrosData.length > 0 ? (
          registrosData.map((registro, index) => {
            return (
              <div className=" bg-brown-main rounded-2xl p-2" key={index}>
                <div className="flex flex-row gap-2 justify-between bg-brown-main rounded-2xl p-2">
                  <p className="font-body text-lg text-right">
                    Horas trabajadas:{" "}
                    <span className="font-bold">
                      {formatHorasTrabajo(registro.horas)}
                    </span>
                  </p>
                  <p className="font-body text-lg text-right">
                    <span className="font-bold">{registro.fecha}</span>
                  </p>
                </div>
                <hr />
                <h2 className="font-body my-2 text-center">Reporte del dia</h2>
                <p className="font-body bg-background p-2 w-full my-2 rounded-2xl text-center whitespace-pre-line">
                  {registro.informe
                    ? registro.informe
                    : "No hay un informe cargado."}
                </p>
              </div>
            );
          })
        ) : (
          <p className="font-body text-lg py-2">
            {registrosData && registrosData.length === 0
              ? "No hay registros en esa fecha."
              : "Por favor, seleccione un mes y año para mostrar contenido."}
          </p>
        )}
      </div>
    </div>
  );
}
