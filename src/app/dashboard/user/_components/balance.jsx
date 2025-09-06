import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

export default function BalanceSemana() {
  const [balance, setBalance] = useState(null);

  const fetchBalance = async () => {
    const res = await fetch("/api/user/getBalanceSemana");
    if (!res.ok) {
      const error = await res.json();
      alert(error.error);
      return;
    }
    const balanceData = await res.json();
    setBalance(balanceData);
  };

  useEffect(() => {
    fetchBalance();
  }, []);

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
      <div className="bg-brown-main p-5 my-2 w-full rounded-2xl">
        {balance.balance.id_empleado ? (
          <div className="font-body grid grid-cols-2 justify-around bg-background p-2 w-full my-2 rounded-2xl text-center">
            <>
              <h2 className="text-lg">Horas trabajadas</h2>
              <h2 className="text-lg">Saldo acumulado</h2>
              <p className="font-body text-3xl">
                {balance.balance.horas_totales}
              </p>
              <p className="font-body text-3xl">
                {balance.balance.saldo_total}
              </p>
            </>
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
  }
}
