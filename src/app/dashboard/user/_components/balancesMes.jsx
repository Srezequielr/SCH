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

  console.log(balancesData);

  useEffect(() => {
    handlerSearch();
  }, []);

  return (
    <div className="bg-brown-main p-5 text-center rounded-2xl w-full">
      <form action="" onSubmit={handlerSearch}>
        <div className="flex flex-row ">
          <input
            type="text"
            placeholder="Mes"
            name="mes"
            required
            className="bg-background p-2 rounded-l-2xl w-full mb-2 focus:outline-solid focus:outline-offset-2 focus:outline-4 focus:outline-brown-detail text-center"
          />
          <input
            type="text"
            placeholder="Año"
            name="año"
            required
            className="bg-background p-2 rounded-r-2xl w-full mb-2 focus:outline-solid focus:outline-offset-2 focus:outline-4 focus:outline-brown-detail text-center"
          />
        </div>
        <button className="bg-brown-detail text-white font-bold w-full py-2 px-4 rounded-2xl disabled:text-gray-400 focus:outline-solid focus:outline-offset-2 focus:outline-4 focus:outline-brown-detail">
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>
      <div className="bg-background flex flex-col gap-2 p-2 w-full mt-2 rounded-2xl">
        {balancesData && balancesData.length > 0 ? (
          balancesData.map((balance, index) => {
            return (
              <div
                key={index}
                className={`${
                  balance.saldo_total ==
                  balance.pagos_realizados
                    ? "border-green-400"
                    : "border-red-400"
                } border-4 bg-brown-main p-5 w-full rounded-2xl`}
              >
                {balance.id_empleado ? (
                  <div className="font-body grid grid-cols-3 justify-around items-center bg-background p-2 w-full rounded-2xl text-center">
                    <h2 className="text-lg">Horas trabajadas</h2>
                    <h2 className="text-lg">Saldo a pagar</h2>
                    <h2 className="text-lg">Saldo pagado</h2>

                    <p className="font-body text-3xl">
                      {formatHorasTrabajo(balance.horas_totales)}
                    </p>
                    <p className="font-body text-3xl">
                      {balance.saldo_total}
                    </p>
                    <p className="font-body text-3xl">
                      {balance.pagos_realizados}
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <p className="font-body bg-background p-2 w-full my-2 rounded-2xl text-center whitespace-pre-line">
                      Aun no hay ningun registro en la chequera
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="font-body text-lg py-2">
            {balancesData && balancesData.length === 0
              ? "No hay balances este mes."
              : "Por favor, seleccione un mes y año para mostrar contenido."}
          </p>
        )}
      </div>
    </div>
  );
}
