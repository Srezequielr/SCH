"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import formatHorasTrabajo from "@/utils/formatHsTrabajo";
import { Icon } from "@iconify/react";

function obtenerGeolocalizacionPrecisa(maxIntentos = 3) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      resolve({
        status: "error",
        errorType: "NO_SOPORTADO",
        message: "Geolocalización no soportada en este navegador",
      });
      return;
    }

    const lecturas = [];
    let mejorPrecision = Infinity;
    let mejorLectura = null;

    const realizarLectura = (intento = 1) => {
      console.log(
        `🎯 Obteniendo ubicación precisa (${intento}/${maxIntentos})...`,
      );

      navigator.geolocation.getCurrentPosition(
        (posicion) => {
          const precision = posicion.coords.accuracy;
          lecturas.push(posicion);

          // Guardar la lectura más precisa
          if (precision < mejorPrecision) {
            mejorPrecision = precision;
            mejorLectura = posicion;
          }

          console.log(`📊 Lectura ${intento}: ${precision}m de precisión`);

          // Si tenemos buena precisión o es el último intento, resolver
          if (precision <= 20 || intento >= maxIntentos) {
            const resultadoFinal = mejorLectura || posicion;

            // Calcular promedio para mayor precisión
            const ubicacionPromediada = calcularPromedioUbicaciones(lecturas);

            resolve({
              status: "success",
              data: {
                lat: ubicacionPromediada.lat,
                long: ubicacionPromediada.lng,
                precision: ubicacionPromediada.precision,
                fuente: ubicacionPromediada.fuente,
                totalLecturas: lecturas.length,
              },
              debug: {
                intentos: intento,
                mejorPrecision: mejorPrecision,
                todasLasLecturas: lecturas.map((l) => ({
                  lat: l.coords.latitude,
                  lng: l.coords.longitude,
                  precision: l.coords.accuracy,
                })),
              },
            });
          } else {
            // Esperar y hacer otro intento
            setTimeout(() => realizarLectura(intento + 1), 2000);
          }
        },
        (error) => {
          console.warn(`⚠️ Intento ${intento} falló:`, error);

          if (intento >= maxIntentos) {
            // Si todos los intentos fallaron
            manejarErrorFinal(error, resolve);
          } else {
            // Reintentar después de un delay
            setTimeout(() => realizarLectura(intento + 1), 2000);
          }
        },
        {
          enableHighAccuracy: true, // 🔥 CLAVE PARA PRECISIÓN
          timeout: 15000, // 15 segundos por intento
          maximumAge: 0, // No usar caché
        },
      );
    };

    // Iniciar el primer intento
    realizarLectura(1);
  });
}

// 🔥 FUNCIÓN PARA CALCULAR PROMEDIO DE LECTURAS
function calcularPromedioUbicaciones(lecturas) {
  if (lecturas.length === 0) {
    throw new Error("No hay lecturas para promediar");
  }

  if (lecturas.length === 1) {
    const lectura = lecturas[0];
    return {
      lat: lectura.coords.latitude,
      lng: lectura.coords.longitude,
      precision: lectura.coords.accuracy,
      fuente: obtenerFuentePrecision(lectura.coords.accuracy),
    };
  }

  // Calcular promedio ponderado por precisión
  let sumaPonderadaLat = 0;
  let sumaPonderadaLng = 0;
  let sumaPesos = 0;
  let precisionPromedio = 0;

  lecturas.forEach((lectura) => {
    const precision = lectura.coords.accuracy;
    const peso = 1 / (precision * precision); // Más peso a lecturas más precisas

    sumaPonderadaLat += lectura.coords.latitude * peso;
    sumaPonderadaLng += lectura.coords.longitude * peso;
    sumaPesos += peso;
    precisionPromedio += precision;
  });

  return {
    lat: sumaPonderadaLat / sumaPesos,
    lng: sumaPonderadaLng / sumaPesos,
    precision: precisionPromedio / lecturas.length,
    fuente: "Promediado múltiples lecturas",
  };
}

// 🔥 DETERMINAR LA FUENTE DE PRECISIÓN
function obtenerFuentePrecision(accuracy) {
  // 🔥 VALIDAR QUE LA PRECISIÓN SEA UN NÚMERO VÁLIDO
  if (!accuracy || accuracy <= 0 || accuracy > 100000) {
    console.warn('❌ Precisión inválida detectada:', accuracy);
    return 'Precisión no disponible';
  }
  
  if (accuracy <= 10) return 'GPS de alta precisión (≤10m)';
  if (accuracy <= 30) return 'GPS estándar (≤30m)';
  if (accuracy <= 50) return 'WiFi/Celular (≤50m)';
  if (accuracy <= 100) return 'Triangulación (≤100m)';
  if (accuracy <= 500) return 'Baja precisión (≤500m)';
  if (accuracy <= 1000) return 'Muy baja precisión (≤1km)';
  return `Precisión limitada (${Math.round(accuracy)}m)`;
}

// 🔥 MANEJO MEJORADO DE ERRORES
function manejarErrorFinal(error, resolve) {
  let errorType, message, recomendacion;

  switch (error.code) {
    case error.PERMISSION_DENIED:
      errorType = "PERMISO DENEGADO";
      message = "Se necesitan permisos de ubicación para marcar entrada";
      recomendacion = "Habilita los permisos de ubicación en tu navegador";
      break;
    case error.POSITION_UNAVAILABLE:
      errorType = "UBICACIÓN NO DISPONIBLE";
      message = "No se pudo obtener la ubicación";
      recomendacion =
        "Verifica que el GPS esté activado y estés en un área con buena recepción";
      break;
    case error.TIMEOUT:
      errorType = "TIEMPO AGOTADO";
      message = "El tiempo de espera se agotó";
      recomendacion =
        "Intenta en un lugar con mejor señal o más cerca de una ventana";
      break;
    default:
      errorType = "ERROR DESCONOCIDO";
      message = "No se pudo obtener la ubicación precisa";
      recomendacion = "Reinicia la aplicación y verifica tu conexión";
  }

  resolve({
    status: "error",
    errorType,
    message: `${message}. ${recomendacion}`,
    originalError: error,
  });
}

// 🔥 FUNCIÓN ORIGINAL MANTENIDA COMO FALLBACK
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
            precision: posicion.coords.accuracy,
            fuente: obtenerFuentePrecision(posicion.coords.accuracy),
          },
        });
      },
      (error) => {
        manejarErrorFinal(error, resolve);
      },
      {
        enableHighAccuracy: true, // 🔥 MEJORADO
        timeout: 10000,
        maximumAge: 0,
      },
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
  const [progresoUbicacion, setProgresoUbicacion] = useState("");

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

  const entradaPrecisa = async () => {
    setLoadingEntrada(true);
    setProgresoUbicacion("Obteniendo ubicación precisa...");

    try {
      const ubicacion = await obtenerGeolocalizacionPrecisa(3);

      if (ubicacion.status == "success") {
        setProgresoUbicacion(
          `Ubicación obtenida (${ubicacion.data.precision.toFixed(1)}m)`,
        );

        // Mostrar información de precisión al usuario
        if (ubicacion.data.precision > 50) {
          Swal.fire({
            icon: "warning",
            title: "Precisión moderada",
            text: `La ubicación tiene una precisión de ${ubicacion.data.precision.toFixed(1)} metros. Para mejor precisión, activa el GPS y ve a un área abierta.`,
            background: mainColor,
            color: "#000000",
            confirmButtonText: "Continuar igual",
            showCancelButton: true,
            cancelButtonText: "Reintentar",
          }).then((result) => {
            if (result.isConfirmed) {
              enviarEntradaAlServidor(ubicacion.data);
            } else {
              setLoadingEntrada(false);
              setProgresoUbicacion("");
            }
          });
        } else {
          enviarEntradaAlServidor(ubicacion.data);
        }
      } else {
        setProgresoUbicacion("");
        Swal.fire({
          icon: "error",
          title: ubicacion.errorType,
          text: ubicacion.message,
          background: mainColor,
          color: "#000000",
        });
        setLoadingEntrada(false);
      }
    } catch (error) {
      setProgresoUbicacion("");
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: "Ocurrió un error al obtener la ubicación",
        background: mainColor,
        color: "#000000",
      });
      setLoadingEntrada(false);
    }
  };

  // 🔥 FUNCIÓN SEPARADA PARA ENVIAR AL SERVIDOR
  const enviarEntradaAlServidor = async (datosUbicacion) => {
    const res = await fetch("/api/user/setEntrada", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosUbicacion),
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
      setLoadingEntrada(false);
      setProgresoUbicacion("");
      return;
    }

    const estado = await fetch("/api/user/setActivo");
    if (!estado.ok) {
      const error = await estado.json();
      Swal.fire({
        icon: "error",
        title: "Error al actualizar estado",
        text: error.error,
        background: mainColor,
        color: "#000000",
      });
      setLoadingEntrada(false);
      setProgresoUbicacion("");
      return;
    }

    onUpdate();
    setProgresoUbicacion("");

    // Mostrar mensaje con información de precisión
    Swal.fire({
      icon: "success",
      title: "Entrada marcada correctamente!",
      background: mainColor,
      color: "#000000",
    });

    setLoadingEntrada(false);
  };

  // 🔥 VERSIÓN SIMPLE COMO FALLBACK (opcional)
  const entradaSimple = async () => {
    setLoadingEntrada(true);
    const ubicacion = await obtenerGeolocalizacion();

    if (ubicacion.status == "success") {
      await enviarEntradaAlServidor(ubicacion.data);
    } else {
      Swal.fire({
        icon: "error",
        title: ubicacion.errorType,
        text: ubicacion.message,
        background: mainColor,
        color: "#000000",
      });
      setLoadingEntrada(false);
    }
  };

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
    <div className="bg-brown-main w-full rounded-2xl p-5 text-center">
      <h2 className="font-body text-3xl">Panel de trabajo</h2>
      {userData.usuario.estado === "Activo" ? (
        <p className="bg-brown-detail my-2 rounded-2xl p-3 text-center text-4xl font-bold text-green-400">
          {userData.usuario.estado}
        </p>
      ) : (
        <p className="bg-brown-detail my-2 rounded-2xl p-3 text-center text-4xl font-bold text-red-400">
          {userData.usuario.estado}
        </p>
      )}
      <p className="font-body py-2 text-lg">
        Esta es la sección de usuario, aquí podrás ver tus horarios y realizar
        otras acciones.
      </p>

      {progresoUbicacion && (
        <div className="mb-3 rounded-lg border border-yellow-400 bg-yellow-100 p-2">
          <div className="flex items-center justify-center space-x-2">
            <Icon icon="mdi:loading" className="animate-spin" />
            <span className="text-sm text-yellow-700">{progresoUbicacion}</span>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-2">
        <button
          onClick={entradaPrecisa}
          className="button_2"
          disabled={disabledEntrada || loadingEntrada}
        >
          {loadingEntrada ? "Obteniendo ubicación..." : "Marcar entrada"}
        </button>
        <button onClick={salida} className="button_2" disabled={disabledSalida}>
          {loadingSalida ? "Marcando salida..." : "Marcar salida"}
        </button>
      </div>
      <div>
        <h2 className="font-body text-2xl">Reporte de dia</h2>
        {disabledReporte ? (
          <p className="font-body bg-background my-2 w-full rounded-2xl p-2 text-center whitespace-pre-line">
            {mensajeReporte}
          </p>
        ) : (
          <form onSubmit={handleReporteSubmit}>
            <textarea
              disabled={disabledReporte}
              name="reporte"
              type="text"
              required
              placeholder="Tareas realizadas en el dia, debe tener el registro de entrada y salida para habilitar este campo."
              className="bg-background focus:outline-brown-detail my-2 h-32 w-full rounded-2xl p-2 focus:outline-4 focus:outline-offset-2 focus:outline-solid"
            />
            <button
              disabled={disabledReporte}
              type="submit"
              className="button_1"
            >
              {loadingReporte ? "Enviendo reporte..." : "Enviar reporte"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
