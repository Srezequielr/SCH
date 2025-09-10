"use client";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import formatHorasTrabajo from "@/utils/formatHsTrabajo";

export default function Balance({ userData }) {
  const mainColor = "#A47864";
  const [balance, setBalance] = useState(null);
  const [busttonDisabled, setButtonDisabled] = useState(false);
  const [pagoInputDisabled, setPagoInputDisabled] = useState(true);
  const [loadingPago, setLoadingPago] = useState(false);

  const fetchBalance = async () => {
    const res = await fetch("/api/admin/getBalanceSemana", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_empleado: userData.id_empleado }),
    });
    if (!res.ok) {
      const error = await res.json();
      alert(error.error);
      return;
    }
    const balanceData = await res.json();
    setBalance(balanceData);
  };

  const setPago = async (event) => {
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
        num_sem: balance.balance.num_semana,
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
    fetchBalance();
  };
  const setInputSueldo = () => {
    setButtonDisabled(true);
    setPagoInputDisabled(false);
  };

  useEffect(() => {
    if (userData) {
      fetchBalance();
    }
  }, [userData]);

  if (!balance) {
    return (
      <div className="bg-brown-main p-5 my-2 w-full rounded-2xl">
        <div className="font-body bg-background p-2 w-full my-2 rounded-2xl text-center flex justify-center">
          <Icon icon="mdi:loading" className="animate-spin text-7xl" />
        </div>
      </div>
    );
  } else {
    return (
      <div className={`${balance.balance.saldo_total == balance.balance.pagos_realizados? "border-green-400": "border-red-400"} border-4 bg-brown-main p-5 w-full rounded-2xl`}>
        {balance.balance.id_empleado ? (
          <>
            <div className="font-body grid grid-cols-3 justify-around items-center bg-background p-2 w-full mb-2 rounded-2xl text-center">
              <h2 className="text-lg">Horas trabajadas</h2>
              <h2 className="text-lg">Saldo a pagar</h2>
              <h2 className="text-lg">Saldo pagado</h2>

              <p className="font-body text-3xl">
                {formatHorasTrabajo(balance.balance.horas_totales)}
              </p>
              <p className="font-body text-3xl">
                {balance.balance.saldo_total}
              </p>
              <p className="font-body text-3xl">
                {balance.balance.pagos_realizados}
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={setInputSueldo}
                disabled={busttonDisabled}
                className="bg-brown-detail text-white font-bold py-2 px-4 rounded-2xl disabled:text-gray-400 focus:outline-solid focus:outline-offset-2 focus:outline-4 focus:outline-brown-detail"
              >
                {loadingPago ? "Registrando pago..." : "Registrar pago"}
              </button>
              {!pagoInputDisabled ? (
                <form action="" onSubmit={setPago}>
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
                      className="bg-brown-detail w-full text-white font-bold py-2 px-4 rounded-2xl disabled:text-gray-400 focus:outline-solid focus:outline-offset-2 focus:outline-4 focus:outline-brown-detail"
                    >
                      Registrar pago
                    </button>
                  </div>
                </form>
              ) : null}
            </div>
          </>
        ) : (
          <div className="">
            <p className="font-body bg-background p-2 w-full my-2 rounded-2xl text-center whitespace-pre-line">
              Aun no hay ningun registro en la chequera
            </p>
          </div>
        )}
      </div>
    );
  }
}
