export default function formatHora(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}