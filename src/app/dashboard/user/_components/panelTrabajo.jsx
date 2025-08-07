"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function PanelTrabajo({ userData, onUpdate, regData }) {
  const mainColor = "#A47864";
  const [disabledEntrada, setDisabledEntrada] = useState(false);
  const [disabledSalida, setDisabledSalida] = useState(false);
  const [disabledReporte, setDisabledReporte] = useState(true);
  const [loadingEntrada, setLoadingEntrada] = useState(false);
  const [loadingSalida, setLoadingSalida] = useState(false);
  const [loadingReporte, setLoadingReporte] = useState(false);
  const [mensajeReporte, setReporteMensaje] = useState("");

  useEffect(() => {
    if (userData && userData.usuario && userData.usuario.estado == "Activo") {
      setDisabledEntrada(true);
      setDisabledSalida(false);
    } else {
      setDisabledEntrada(false);
      setDisabledSalida(true);
    }

    if (regData) {
      console.log(regData);

      if (Object.keys(regData).length !== 0) {
        if (regData.registro?.informe_cargado) {
          setDisabledReporte(true);
          setReporteMensaje("Reporte ya cargado.");
        } else {
          setDisabledReporte(false);
        }
      } else {
        setDisabledReporte(true);
        setReporteMensaje("Primero hay que registrar la jornada.");
      }
    }
  }, [userData, regData]);

  const entrada = async () => {
    setLoadingEntrada(true);
    const res = await fetch("/api/entrada");
    setLoadingEntrada(false);
    if (!res.ok) {
      const error = await res.json();
      Swal.fire({
        icon: "error",
        title: "No se pudo marcar la entrada.",
        text: error.error,
        background: mainColor,
        color: "#000000",
      });
      return;
    }
    const estado = await fetch("/api/activo");
    if (!estado.ok) {
      const error = await estado.json();
      alert(error.error);
      return;
    }
    onUpdate();
    Swal.fire({
      icon: "success",
      title: "Entrada marcada correctamente!",
      background: mainColor,
      color: "#000000",
    });
  };

  const salida = async () => {
    setLoadingSalida(true);
    const res = await fetch("/api/salida");
    setLoadingSalida(false);
    if (!res.ok) {
      const error = await res.json();
      Swal.fire({
        icon: "error",
        title: "No se pudo marcar la salida.",
        text: error.error,
        background: mainColor,
        color: "#000000",
      });
      return;
    }

    const data = await res.json();
    const horasTotales = data.intervalo[0].horas_trabajadas.toFixed(2);

    const estado = await fetch("/api/inactivo");
    if (!estado.ok) {
      const error = await estado.json();
      Swal.fire({
        icon: "error",
        title: "No se pudo marcar la salida.",
        text: error.error,
        background: mainColor,
        color: "#000000",
      });
      return;
    }
    Swal.fire({
      icon: "success",
      title: "Salida marcada correctamente!",
      text: "horas trabajadas: " + horasTotales,
      background: mainColor,
      color: "#000000",
    });
    onUpdate();
  };

  const handleReporteSubmit = async (event) => {
    event.preventDefault();
    setLoadingReporte(true);
    const input = event.target.reporte.value;
    const res = await fetch("/api/reporte", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reporte: input }),
    });
    setLoadingReporte(false);
    if (!res.ok) {
      const error = await res.json();
      Swal.fire({
        icon: "error",
        title: "No se pudo subir el reporte.",
        text: error.error,
        background: mainColor,
        color: "#000000",
      });
      return;
    }
    Swal.fire({
      icon: "success",
      title: "Reporte subido correctamente!",
      background: mainColor,
      color: "#000000",
    });
    onUpdate();
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
          {loadingEntrada ? "Marcando entrada..." : "Marcar entrada"}
        </button>
        <button
          onClick={salida}
          className="bg-brown-detail text-white font-bold py-2 px-4 rounded-2xl disabled:text-gray-400"
          disabled={disabledSalida}
        >
          {loadingSalida ? "Marcando salida..." : "Marcar salida"}
        </button>
      </div>
      <div>
        <h2 className="font-body text-2xl">Reporte de dia</h2>
        {disabledReporte ? (
          mensajeReporte
        ) : (
          <form onSubmit={handleReporteSubmit}>
            <textarea
              disabled={disabledReporte}
              name="reporte"
              type="text"
              placeholder="Tareas realizadas en el dia, debe tener el registro de entrada y salida para habilitar este campo."
              className="bg-background p-2 rounded-2xl w-full my-2 h-32"
            />
            <button
              disabled={disabledReporte}
              type="submit"
              className="bg-brown-detail font-bold py-2 px-4 rounded-2xl mt-2"
            >
              {loadingReporte ? "Enviendo reporte..." : "Enviar reporte"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
