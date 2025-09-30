"use client";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import BalanceCard from "./balanceCard";

export default function BalanceSemana({ userData }) {
  const [balance, setBalance] = useState(null);

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
  }

  if (balance.balance.id_empleado) {
    return <BalanceCard balance={balance.balance} onUpdate={fetchBalance} />;
  } else {
    return (
      <div className="bg-brown-main mb-2 w-full rounded-2xl p-5">
        <p className="font-body bg-background p-2 w-full my-2 rounded-2xl text-center whitespace-pre-line">
          Aun no hay ningun registro en la chequera
        </p>
      </div>
    )
  }
}