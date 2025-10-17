import formatHorasTrabajo from "@/utils/formatHsTrabajo";

export default function BalanceCard({ balance }) {
  return (
    <div>
      <div
        className={`${
          balance.saldo_total == balance.pagos_realizados
            ? "border-green-400"
            : "border-red-400"
        } bg-brown-main mb-2 w-full rounded-2xl border-4 p-5`}
      >
        {balance.id_empleado ? (
          <>
            <div className="mb-2 flex flex-row justify-between gap-2">
              <p className="font-body text-lg">
                Num. semana: {""}
                <span className="font-bold">{balance.num_semana}</span>
              </p>
              <p className="font-body text-lg">
                Num. mes: {""}
                <span className="font-bold">{balance.num_mes}</span>
              </p>
            </div>
            <hr />
            <div className="font-body bg-background mt-2 grid w-full grid-cols-3 items-center justify-around rounded-2xl p-2 text-center">
              <h2 className="text-lg leading-none">Horas trabajadas</h2>
              <h2 className="text-lg leading-none">Saldo a pagar</h2>
              <h2 className="text-lg leading-none">Saldo pagado</h2>

              <p className="font-body text-2xl">
                {formatHorasTrabajo(balance.horas_totales)}
              </p>
              <p className="font-body text-2xl">{balance.saldo_total}</p>
              <p className="font-body text-2xl">{balance.pagos_realizados}</p>
            </div>
          </>
        ) : (
          <div className="">
            <p className="font-body bg-background my-2 w-full rounded-2xl p-2 text-center whitespace-pre-line">
              Aun no hay ningun registro en la chequera
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
