import formatHorasTrabajo from "@/utils/formatHsTrabajo";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function BalancesMes({ userData }) {
  const [loading, setLoading] = useState(false);
  const mainColor = "#A47864";
  const [busttonDisabled, setButtonDisabled] = useState(false);
  const [pagoInputDisabled, setPagoInputDisabled] = useState(true);
  const [loadingPago, setLoadingPago] = useState(false);

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
    const res = await fetch("/api/admin/getBalancesMes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_empleado: userData.id_empleado,
        mes: mes,
        año: año,
      }),
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

  const setPago = async (event, num_semana) => {
    event.preventDefault();
    setLoadingPago(true);
    const pago = event.target.pago.value;
    setPagoInputDisabled(true);

    const res = await fetch("/api/admin/setPago", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_empleado: userData.id_empleado,
        pago: pago,
        num_sem: num_semana,
      }),
    });
    if (!res.ok) {
      const error = await res.json();
      Swal.fire({
        icon: "error",
        title: "No se pudo acreditar el pago.",
        text: error.error,
        background: mainColor,
        color: "#000000",
      });
      setLoadingPago(false);
      setButtonDisabled(false);
      return;
    }
    Swal.fire({
      icon: "success",
      title: "Sueldo actualizado correctamente!",
      background: mainColor,
      color: "#000000",
    });
    setLoadingPago(false);
    setButtonDisabled(false);
    handlerSearch();
  };
  const setInputSueldo = () => {
    setButtonDisabled(true);
    setPagoInputDisabled(false);
  };

  useEffect(() => {
    if (userData) {
      handlerSearch();
    }
  }, [userData]);

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
        <button className="button_2">
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>
      <div className="bg-background flex flex-col gap-2 p-2 w-full mt-2 rounded-2xl">
        {balancesData && balancesData.length > 0 ? (
          balancesData.map((balance, index) => {
            return (
              <div key={index}>
                <div
                  className={`${
                    balance.saldo_total == balance.pagos_realizados
                      ? "border-green-400"
                      : "border-red-400"
                  } border-4 bg-brown-main p-5 w-full rounded-2xl mb-2`}
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
                <div className="flex flex-col gap-2">
                  <button
                    onClick={setInputSueldo}
                    disabled={busttonDisabled}
                    className="button_2"
                  >
                    {loadingPago ? "Registrando pago..." : "Registrar pago"}
                  </button>
                  {!pagoInputDisabled ? (
                    <form
                      action=""
                      onSubmit={(event) => setPago(event, balance.num_semana)}
                    >
                      <div className="flex flex-row gap-1.5">
                        <input
                          type="number"
                          placeholder="Pago"
                          name="pago"
                          required
                          className="text-center bg-background rounded-2xl w-full focus:outline-solid focus:outline-offset-2 focus:outline-4 focus:outline-brown-detail"
                        />
                        <button
                          type="submit"
                          className="button_2"
                        >
                          Registrar pago
                        </button>
                      </div>
                    </form>
                  ) : null}
                </div>
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
