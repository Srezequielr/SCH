"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PanelTrabajo from "./_components/panelTrabajo";
import Registro from "./_components/registro";
import RegistrosSemana from "./_components/registrosSemana";
import RegistrosMes from "./_components/registrosMes";
import BalanceSemana from "./_components/balance";

export default function user() {
  const [userData, setUserData] = useState(null);
  const [registroData, setRegistroData] = useState(null);
  const [intervalo, setIntervalo] = useState(null);
  const fechaActual = new Date();
  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth() + 1;
  const dia = fechaActual.getDate();

  const fetchData = async () => {
    const res = await fetch("/api/getUser");
    if (!res.ok) {
      const error = await res.json();
      alert(error.error);
      return;
    }
    const userData = await res.json();
    setUserData(userData);

    const registroRes = await fetch("/api/user/getRegistroDia");
    if (!registroRes.ok) {
      const error = await registroRes.json();
      alert(error.error);
      return;
    }
    const registroData = await registroRes.json();
    setRegistroData(registroData);

    const intervaloRes = await fetch("/api/user/getIntervaloDia");
    if (!intervaloRes.ok) {
      const error = await intervaloRes.json();
      alert(error.error);
      return;
    }
    const intervaloData = await intervaloRes.json();
    setIntervalo(intervaloData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!userData || !registroData || !intervalo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icon icon="mdi:loading" className="animate-spin text-7xl" />
      </div>
    );
  } else
    return (
      <section className="flex flex-col items-center min-h-screen gap-5 px-5 py-10">
        <div className="w-full">
          <div className="flex items-center justify-between bg-brown-main p-2 text-center rounded-2xl mb-2 w-full">
            <p className="font-body font-bold">{`${dia}/${mes}/${año}`}</p>
            <p className="font-body">Dashboard</p>
          </div>
          <h1 className="font-title text-4xl text-center">
            Bienvenido {userData.usuario.nombre}!
          </h1>
        </div>
        <PanelTrabajo
          userData={userData}
          regData={registroData}
          onUpdate={fetchData}
        />
        <h2 className="font-title text-3xl">Registro del dia.</h2>
        <Registro
          registro={registroData.registro}
          intervalo={intervalo.intervalos}
        />
        <h2 className="font-title text-3xl">Balance de la semana.</h2>
        <BalanceSemana />
        <h2 className="font-title text-3xl">Registros de la semana.</h2>
        <RegistrosSemana />
        <h2 className="font-title text-3xl">Registros del mes.</h2>
        <RegistrosMes />
        <h2 className="font-title text-3xl">Mis datos.</h2>
        <div className="bg-brown-main p-5 text-center rounded-2xl w-full">
          <div className="flex flex-row gap-2 mt-2 justify-between">
            <div className="align-left">
              <p className="font-body text-lg text-left">
                Nombre:{" "}
                <span className="font-bold">{userData.usuario.nombre}</span>
              </p>
              <p className="font-body text-lg text-left">
                Apellido:{" "}
                <span className="font-bold">{userData.usuario.apellido}</span>
              </p>
            </div>
            <div className="align-right">
              <p className="font-body text-lg text-right">
                Cargo:{" "}
                <span className="font-bold">{userData.usuario.cargo}</span>
              </p>
              <p className="font-body text-lg text-right">
                Sueldo $/h:{" "}
                <span className="font-bold">{userData.usuario.sueldo}</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    );
}
