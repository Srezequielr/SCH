"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import formatHorasTrabajo from "@/utils/formatHsTrabajo";

function obtenerGeolocalizacion() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      resolve({
        status: "error",
        errorType: "NO_SOPORTADO",
        message: "Geolocalización no soportada en este navegador",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (posicion) => {
        resolve({
          status: "success",
          data: {
            lat: posicion.coords.latitude,
            long: posicion.coords.longitude,
          },
        });
      },
      (error) => {
        let errorType, message;
        // Mapeamos los códigos de error a mensajes más descriptivos
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorType = "PERMISO DENEGADO";
            message = "El usuario denegó los permisos de geolocalización";
            break;
          case error.POSITION_UNAVAILABLE:
            errorType = "NO DISPONIBLE";
            message = "La información de ubicación no está disponible";
            break;
          case error.TIMEOUT:
            errorType = "TIMEOUT";
            message = "Tiempo de espera agotado al obtener la ubicación";
            break;
          default:
            errorType = "DESCONOCIDO";
            message = "Error desconocido al obtener la ubicación";
        }
        resolve({
          status: "error",
          errorType,
          message,
          originalError: error,
        });
      }
    );
  });
}

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

  //  Manejar entrada del usuario
  const entrada = async () => {
    setLoadingEntrada(true);
    const ubicacion = await obtenerGeolocalizacion();

    if (ubicacion.status == "success") {
      const res = await fetch("/api/user/setEntrada", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ubicacion.data),
      });
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
      const estado = await fetch("/api/user/setActivo");
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
    } else {
      Swal.fire({
        icon: "error",
        title: ubicacion.errorType,
        text: ubicacion.message,
        background: mainColor,
        color: "#000000",
      });
    }
    setLoadingEntrada(false);
  };

  // Manejar salida del usuario
  const salida = async () => {
    setLoadingSalida(true);
    const res = await fetch("/api/user/setSalida");
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

    const estado = await fetch("/api/user/setInactivo");
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
      text: "horas trabajadas: " + formatHorasTrabajo(horasTotales),
      background: mainColor,
      color: "#000000",
    });
    onUpdate();
  };

  const handleReporteSubmit = async (event) => {
    event.preventDefault();
    setLoadingReporte(true);
    const input = event.target.reporte.value;
    const res = await fetch("/api/user/setReporte", {
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
          className="bg-brown-detail text-white font-bold py-2 px-4 rounded-2xl disabled:text-gray-400 focus:outline-solid focus:outline-offset-2 focus:outline-4 focus:outline-brown-detail"
          disabled={disabledEntrada}
        >
          {loadingEntrada ? "Marcando entrada..." : "Marcar entrada"}
        </button>
        <button
          onClick={salida}
          className="bg-brown-detail text-white font-bold py-2 px-4 rounded-2xl disabled:text-gray-400 focus:outline-solid focus:outline-offset-2 focus:outline-4 focus:outline-brown-detail"
          disabled={disabledSalida}
        >
          {loadingSalida ? "Marcando salida..." : "Marcar salida"}
        </button>
      </div>
      <div>
        <h2 className="font-body text-2xl">Reporte de dia</h2>
        {disabledReporte ? (
          <p className="font-body bg-background p-2 w-full my-2 rounded-2xl text-center whitespace-pre-line">
            {mensajeReporte}
          </p>
        ) : (
          <form onSubmit={handleReporteSubmit}>
            <textarea
              disabled={disabledReporte}
              name="reporte"
              type="text"
              placeholder="Tareas realizadas en el dia, debe tener el registro de entrada y salida para habilitar este campo."
              className="bg-background p-2 rounded-2xl w-full my-2 h-32 focus:outline-solid focus:outline-offset-2 focus:outline-4 focus:outline-brown-detail"
            />
            <button
              disabled={disabledReporte}
              type="submit"
              className="bg-brown-detail font-bold py-2 px-4 rounded-2xl mt-2 focus:outline-solid focus:outline-offset-2 focus:outline-4 focus:outline-brown-detail"
            >
              {loadingReporte ? "Enviendo reporte..." : "Enviar reporte"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
