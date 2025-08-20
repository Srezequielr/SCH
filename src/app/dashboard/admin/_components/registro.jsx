import Link from "next/link";

export function formatHora(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function Registro({ empleado }) {
  return (
    <div className="bg-brown-main p-5 my-2 w-full rounded-2xl">
      <div className="flex flex-row gap-2 justify-between my-2">
        <p className="font-body text-lg text-right">
          Nombre: <span className="font-bold">{empleado.nombre}</span>
        </p>
        <p className="font-body text-lg text-right">
          Sueldo $/h: <span className="font-bold">{empleado.sueldo}</span>
        </p>
      </div>
      <hr />
      <div className="flex flex-row gap-2 justify-between my-2">
        <p className="font-body text-lg text-right">
          Horas trabajadas:{" "}
          <span className="font-bold">{empleado.registros[0].horas}</span>
        </p>
        <p className="font-body text-lg text-right">
          <span className="font-bold">{empleado.registros[0].fecha}</span>
        </p>
      </div>
      {empleado.registros[0].intervalos.map((intervalo, index) => {
        return (
          <div key={index} className="flex justify-center items-center my-2">
            <span className="font-bold">
              {formatHora(intervalo.hora_entrada)} -{" "}
              {intervalo.hora_salida
                ? formatHora(intervalo.hora_salida)
                : "Trabajando..."}
            </span>
          </div>
        );
      })}
      <hr />
      <h2 className="font-body text-2xl my-2 text-center">Reporte del dia</h2>
      <p className="font-body bg-background p-2 w-full my-2 rounded-2xl text-center whitespace-pre-line">
        {empleado.registros[0].informe
          ? empleado.registros[0].informe
          : "Aun no hay un informe cargado."}
      </p>
      <h2 className="font-body text-2xl my-2 text-center">
        Ubicacion donde empezo al jornada
      </h2>
      <div className="flex justify-center">
        <p className="bg-brown-detail py-2 px-4 rounded-2xl">
          {empleado.registros[0].latitud ? (
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${empleado.registros[0].latitud},${empleado.registros[0].longitud}`}
            >
              Ver ubicacion{" "}
            </Link>
          ) : (
            "Ubicacion no disponible"
          )}
        </p>
      </div>
    </div>
  );
}
