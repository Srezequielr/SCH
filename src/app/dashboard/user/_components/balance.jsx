import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import formatHorasTrabajo from "@/utils/formatHsTrabajo";

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
        <div className="font-body bg-background p-2 w-full my-2 rounded-2xl flex justify-center">
          <Icon icon="mdi:loading" className="animate-spin text-7xl" />
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`${
          balance.balance.saldo_total == balance.balance.pagos_realizados
            ? "border-green-400"
            : "border-red-400"
        } border-4 bg-brown-main p-5 w-full rounded-2xl`}
      >
        {balance.balance.id_empleado ? (
          <div className="font-body grid grid-cols-3 justify-around items-center bg-background p-2 w-full rounded-2xl text-center">
            <h2 className="text-lg">Horas trabajadas</h2>
            <h2 className="text-lg">Saldo a pagar</h2>
            <h2 className="text-lg">Saldo pagado</h2>

            <p className="font-body text-3xl">
              {formatHorasTrabajo(balance.balance.horas_totales)}
            </p>
            <p className="font-body text-3xl">{balance.balance.saldo_total}</p>
            <p className="font-body text-3xl">
              {balance.balance.pagos_realizados}
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
  }
}
