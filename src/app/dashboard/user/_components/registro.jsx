import { formatHora } from "../../admin/_components/registro";

export default function Registro({ registro, intervalo }) {
  return (
    <div className="bg-brown-main p-5 my-2 w-full rounded-2xl">
      <div className="flex flex-row gap-2 justify-between my-2">
        <p className="font-body text-lg text-right">
          Horas trabajadas: <span className="font-bold">{registro.horas}</span>
        </p>
        <p className="font-body text-lg text-right">
          <span className="font-bold">{registro.fecha}</span>
        </p>
      </div>
      <hr />
      {intervalo.map((intervalo, index) => {
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
      <h2 className="font-body text-2xl my-2 text-center">Reporte del dia</h2>
      <p className="font-body bg-background p-2 w-full my-2 rounded-2xl text-center whitespace-pre-line">
        {registro.informe
          ? registro.informe
          : "Aun no has cargado ningun reporte."}
      </p>
    </div>
  );
}
