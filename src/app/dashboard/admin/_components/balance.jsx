"use client";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export default function Balance({ userData }) {
  const [balance, setBalance] = useState(null);
  const [busttonDisabled, setButtonDisabled] = useState(false);
  const [sueldoInputDisabled, setSueldoInputDisabled] = useState(true);
  const [loadingSueldo, setLoadingSueldo] = useState(false);

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

  const setInputSueldo = () => {
    setButtonDisabled(true);
    setSueldoInputDisabled(false);
  };

  useEffect(() => {
    if (userData) {
      fetchBalance();
    }
  }, [userData]);

  if (!balance) {
    return (
      <div className="bg-brown-main p-5 my-2 w-full rounded-2xl">
        <div className="font-body bg-background p-2 w-full my-2 rounded-2xl text-center">
          <Icon icon="mdi:loading" className="animate-spin text-7xl" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-brown-main p-5 w-full rounded-2xl">
        {balance.balance.id_empleado ? (
          <>
            <div className="font-body grid grid-cols-3 justify-around bg-background p-2 w-full my-2 rounded-2xl text-center">
              <h2 className="text-lg">Horas trabajadas</h2>
              <h2 className="text-lg">Saldo acumulado</h2>
              <h2 className="text-lg">Pagos realizados</h2>

              <p className="font-body text-3xl">
                {balance.balance.horas_totales}
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
                {loadingSueldo ? "Registrando pago..." : "Registrar pago"}
              </button>
              {!sueldoInputDisabled ? (
                <form action="">
                  <div className="flex flex-row gap-1.5">
                    <input
                      type="number"
                      placeholder="Sueldo"
                      name="sueldo"
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
