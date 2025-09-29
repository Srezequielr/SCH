import formatHorasTrabajo from "@/utils/formatHsTrabajo";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import BalanceCard from "./balanceCard";

export default function BalancesMes({ userData }) {
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

  useEffect(() => {
    if (userData) {
      handlerSearch();
    }
  }, [userData]);

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
              <BalanceCard
                key={index}
                balance={balance}
                onUpdate={handlerSearch}
              />
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
