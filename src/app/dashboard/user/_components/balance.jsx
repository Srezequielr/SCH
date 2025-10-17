import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import BalanceCard from "./balanceCard";

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
      <div className="bg-brown-main my-2 w-full rounded-2xl p-5">
        <div className="font-body bg-background my-2 flex w-full justify-center rounded-2xl p-2 text-center">
          <Icon icon="mdi:loading" className="animate-spin text-7xl" />
        </div>
      </div>
    );
  }

  if (balance.balance.id_empleado) {
    return <BalanceCard balance={balance.balance} />;
  } else {
    return (
      <div className="bg-brown-main mb-2 w-full rounded-2xl p-5">
        <p className="font-body bg-background my-2 w-full rounded-2xl p-2 text-center whitespace-pre-line">
          Aun no hay ningun registro en la chequera
        </p>
      </div>
    );
  }
}
