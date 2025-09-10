"use client";
import { Icon } from "@iconify/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import RegistrosSemana from "../../_components/registrosSemana";
import RegistrosMes from "../../_components/registrosMes";
import Swal from "sweetalert2";
import Balance from "../../_components/balance";
import getFechaActual from "@/utils/getFechaActual";
import BalancesMes from "../../_components/balancesMes";

export default function Empleado() {
  const mainColor = "#A47864";
  const [userData, setUserData] = useState(null);
  const [busttonDisabled, setButtonDisabled] = useState(false);
  const [sueldoInputDisabled, setSueldoInputDisabled] = useState(true);
  const [loadingSueldo, setLoadingSueldo] = useState(false);

  const params = useParams();
  const id = params.id;

  const fetchData = async () => {
    const resUser = await fetch("/api/getUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_empleado: id }),
    });
    if (!resUser.ok) {
      const error = await resUser.json();
      alert(error.error);
      return;
    }
    const userData = await resUser.json();
    setUserData(userData.usuario);
  };

  const setInputSueldo = () => {
    setButtonDisabled(true);
    setSueldoInputDisabled(false);
  };

  const setSueldo = async (event) => {
    event.preventDefault();
    setLoadingSueldo(true);
    const sueldo = event.target.sueldo.value;
    setSueldoInputDisabled(true);
    const res = await fetch("/api/admin/setSueldo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_empleado: id, sueldo: sueldo }),
    });
    if (!res.ok) {
      const error = await res.json();
      Swal.fire({
        icon: "error",
        title: "No se pudo actualizar el sueldo.",
        text: error.error,
        background: mainColor,
        color: "#000000",
      });
      return;
    }
    Swal.fire({
      icon: "success",
      title: "Sueldo actualizado correctamente!",
      background: mainColor,
      color: "#000000",
    });
    setButtonDisabled(false);
    setLoadingSueldo(false);
    fetchData();
  };

  useEffect(() => {
    fetchData(id);
  }, []);

  return (
    <section className="flex flex-col items-center min-h-screen gap-5 py-10 px-5">
      <div className="w-full">
        <div className="flex items-center justify-between bg-brown-main p-2 text-center rounded-2xl mb-2">
          <p className="font-body font-bold">{getFechaActual()}</p>
          <p className="font-body">Dashboard</p>
        </div>
      </div>
      <div className="bg-brown-main p-5 text-center rounded-2xl w-full">
        {userData ? (
          <div>
            <h1 className="font-title text-4xl text-center">
              {userData.nombre} {userData.apellido}
            </h1>
            <hr />
            {userData.estado === "Activo" ? (
              <p className="bg-brown-detail text-green-400 text-center font-bold text-2xl p-2 rounded-2xl my-2">
                {userData.estado}
              </p>
            ) : (
              <p className="bg-brown-detail text-red-400 text-center font-bold text-2xl p-2 rounded-2xl my-2">
                {userData.estado}
              </p>
            )}
            <div className="flex flex-row gap-2 my-4 justify-between">
              <p className="font-body text-lg text-right">
                Cargo: <span className="font-bold">{userData.cargo}</span>
              </p>
              <p className="font-body text-lg text-right">
                Sueldo $/h: <span className="font-bold">{userData.sueldo}</span>
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={setInputSueldo}
                disabled={busttonDisabled}
                className="bg-brown-detail text-white font-bold py-2 px-4 rounded-2xl disabled:text-gray-400 focus:outline-solid focus:outline-offset-2 focus:outline-4 focus:outline-brown-detail"
              >
                {loadingSueldo ? "Modificando sueldo..." : "Modificar sueldo"}
              </button>
              {!sueldoInputDisabled ? (
                <form action="" onSubmit={setSueldo}>
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
                      Actualizar sueldo
                    </button>
                  </div>
                </form>
              ) : null}
            </div>
          </div>
        ) : (
          <Icon icon="mdi:loading" className="animate-spin text-7xl m-auto" />
        )}
      </div>
      <h2 className="font-body text-3xl">Balance de la semana.</h2>
      <Balance userData={userData} />
      <h2 className="font-body text-3xl">Balances del mes.</h2>
      <BalancesMes userData={userData}/>
      <h2 className="font-body text-3xl">Registros de la semana.</h2>
      {userData ? (
        <RegistrosSemana dni_empleado={userData?.dni} />
      ) : (
        <div className="p-5 text-center rounded-2xl w-full">
          <Icon icon="mdi:loading" className="animate-spin text-7xl m-auto" />
        </div>
      )}
      <h2 className="font-title text-3xl">Registros del mes.</h2>
      <RegistrosMes dni={userData?.dni} />
    </section>
  );
}
