import formatHorasTrabajo from "@/utils/formatHsTrabajo";
import { useEffect, useState } from "react";

export default function BalancesMes() {
  const [loading, setLoading] = useState(false);

  const [balancesData, setBalancesData] = useState(null);
  const handlerSearch = async (event) => {
    let mes;
    let año;
    if (event) {
      setLoading(true);
      event.preventDefault();
      mes = event.target.mes.value;
      año = event.target.año.value;
    } else {
      const fechaActual = new Date();
      año = fechaActual.getFullYear();
      mes = fechaActual.getMonth() + 1;
    }
    const res = await fetch("/api/user/getBalancesMes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mes: mes, año: año }),
    });
    if (!res.ok) {
      const error = await res.json();
      alert(error.error);
      return;
    }
    const balancesMesData = await res.json();
    setBalancesData(balancesMesData.balances);

    setLoading(false);
  };

  useEffect(() => {
    handlerSearch();
  }, []);

  return (
    <div className="bg-brown-main w-full rounded-2xl p-5 text-center">
      <form action="" onSubmit={handlerSearch}>
        <div className="flex flex-row">
          <input
            type="text"
            placeholder="Mes"
            name="mes"
            required
            className="bg-background focus:outline-brown-detail mb-2 w-full rounded-l-2xl p-2 text-center focus:outline-4 focus:outline-offset-2 focus:outline-solid"
          />
          <input
            type="text"
            placeholder="Año"
            name="año"
            required
            className="bg-background focus:outline-brown-detail mb-2 w-full rounded-r-2xl p-2 text-center focus:outline-4 focus:outline-offset-2 focus:outline-solid"
          />
        </div>
        <button className="button_2">
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>
      <div className="bg-background mt-2 flex w-full flex-col gap-2 rounded-2xl p-2">
        {balancesData && balancesData.length > 0 ? (
          balancesData.map((balance, index) => {
            return (
              <div
                key={index}
                className={`${balance.saldo_total == balance.pagos_realizados
                  ? "border-green-400"
                  : "border-red-400"
                  } bg-brown-main w-full rounded-2xl border-4 p-5`}
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

                      <p className="font-body text-3xl">
                        {formatHorasTrabajo(balance.horas_totales)}
                      </p>
                      <p className="font-body text-3xl">{balance.saldo_total}</p>
                      <p className="font-body text-3xl">
                        {balance.pagos_realizados}
                      </p>
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
            );
          })
        ) : (
          <p className="font-body py-2 text-lg">
            {balancesData && balancesData.length === 0
              ? "No hay balances este mes."
              : "Por favor, seleccione un mes y año para mostrar contenido."}
          </p>
        )}
      </div>
    </div>
  );
}
