export default function getFechaActual() {
  const fechaActual = new Date();
  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth() + 1;
  const dia = fechaActual.getDate();
  return `${dia}/${mes}/${año}`;
}
