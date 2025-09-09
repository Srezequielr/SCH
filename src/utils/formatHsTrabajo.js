export default function formatHorasTrabajo(horasDecimales) {
  if (horasDecimales === null || horasDecimales === undefined) {
    return "--:--";
  }

  const horas = Math.floor(horasDecimales);
  const minutos = Math.round((horasDecimales - horas) * 60);

  return `${horas.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}`;
}
