import formatHora from "@/utils/formatHorario";
import formatHorasTrabajo from "@/utils/formatHsTrabajo";

export default function Registro({ registro, intervalo }) {
  if (!registro) {
    return (
      <div className="bg-brown-main p-5 my-2 w-full rounded-2xl">
        <p className="font-body bg-background p-2 w-full my-2 rounded-2xl text-center whitespace-pre-line">
          Aun no hay ningun registros el dia de la fecha
        </p>
      </div>
    );
  }

  return (
    <div className="bg-brown-main p-5 my-2 w-full rounded-2xl">
      <div className="flex flex-row gap-2 justify-between my-2">
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
      {intervalo && (
        <div className="flex justify-center rounded-lg border-brown-detail my-2">
          <table className="table-auto border-2 border-brown-detail">
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
              {intervalo.map((intervalo, index, array) => {
                const isLast = index === array.length - 1;
                return (
                  <tr
                    key={index}
                    className={!isLast ? "border-b-2 border-brown-detail" : ""}
                  >
                    <td className="text-center px-4 py-3 bg-background">
                      {formatHora(intervalo.hora_entrada)}
                    </td>
                    <td className="text-center px-4 py-3 bg-background">
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
      )}
      <h2 className="font-body text-2xl my-2 text-center">Reporte del dia</h2>
      <p className="font-body bg-background p-2 w-full my-2 rounded-2xl text-center whitespace-pre-line">
        {registro.informe
          ? registro.informe
          : "No se ha cargado ningun reporte."}
      </p>
    </div>
  );
}
