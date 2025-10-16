import Link from "next/link";
import formatHorasTrabajo from "@/utils/formatHsTrabajo";
import formatHora from "@/utils/formatHorario";
import Mapa from "./mapa";

export default function Registro({ empleado }) {
  return (
    <div className="bg-brown-main my-2 w-full rounded-2xl p-5">
      <div className="my-2 flex flex-row justify-between gap-2">
        <p className="font-body text-right text-lg">
          Nombre: <span className="font-bold">{empleado.nombre}</span>
        </p>
        <p className="font-body text-right text-lg">
          Sueldo $/h: <span className="font-bold">{empleado.sueldo}</span>
        </p>
      </div>
      <hr />
      <div className="my-2 flex flex-row justify-between gap-2">
        <p className="font-body text-right text-lg">
          Horas trabajadas:{" "}
          <span className="font-bold">
            {formatHorasTrabajo(empleado.registros[0].horas)}
          </span>
        </p>
        <p className="font-body text-right text-lg">
          <span className="font-bold">{empleado.registros[0].fecha}</span>
        </p>
      </div>
      <div className="border-brown-detail my-2 flex justify-center rounded-lg">
        <table className="border-brown-detail table-auto border-2">
          <thead className="bg-brown-detail">
            <tr>
              <th scope="col" className="px-4 py-2">
                Hora de entrada
              </th>
              <th scope="col" className="px-4 py-2">
                Hora de salida
              </th>
            </tr>
          </thead>
          <tbody>
            {empleado.registros[0].intervalos.map((intervalo, index, array) => {
              const isLast = index === array.length - 1;
              return (
                <tr
                  key={index}
                  className={!isLast ? "border-brown-detail border-b-2" : ""}
                >
                  <td className="bg-background px-4 py-3 text-center">
                    {formatHora(intervalo.hora_entrada)}
                  </td>
                  <td className="bg-background px-4 py-3 text-center">
                    {intervalo.hora_salida
                      ? formatHora(intervalo.hora_salida)
                      : "Trabajando..."}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <hr />
      <h2 className="font-body my-2 text-center text-2xl">Reporte del dia</h2>
      <p className="font-body bg-background my-2 w-full rounded-2xl p-2 text-center whitespace-pre-line">
        {empleado.registros[0].informe
          ? empleado.registros[0].informe
          : "Aun no hay un informe cargado."}
      </p>
      <div className="flex justify-center">
        {empleado.registros[0].latitud ? (
          <Mapa
            lat={empleado.registros[0].latitud}
            lng={empleado.registros[0].longitud}
            nombre = {empleado.nombre}
          />
        ) : (
          <p className="button_1">"Ubicacion no disponible"</p>
        )}
      </div>
    </div>
  );
}
