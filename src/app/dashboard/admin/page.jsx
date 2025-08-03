export default function admin() {
  const fechaActual = new Date();
  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth() + 1;
  const dia = fechaActual.getDate();
  return (
    <div className="flex flex-col items-center min-h-screen gap-10 p-5">
      <h1 className="font-title text-4xl">Bienvenido Admin!</h1>
    </div>
  );
}
