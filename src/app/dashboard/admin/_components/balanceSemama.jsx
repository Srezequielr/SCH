"use client";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import formatHorasTrabajo from "@/utils/formatHsTrabajo";
import BalanceCard from "./balanceCard";

export default function BalanceSemana({ userData }) {
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