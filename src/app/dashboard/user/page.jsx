"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PanelTrabajo from "./_components/panelTrabajo";
import Registro from "./_components/registro";

export default function user() {
  const [userData, setUserData] = useState(null);
  const [registroData, setRegistroData] = useState(null);
  const [intervalo, setIntervalo] = useState(null);
  const fechaActual = new Date();
  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth() + 1;
  const dia = fechaActual.getDate();

  const fetchData = async () => {
    const res = await fetch("/api/user");
    if (!res.ok) {
      const error = await res.json();
      alert(error.error);
      return;
    }
    const userData = await res.json();
    setUserData(userData);

    const registroRes = await fetch("/api/registroDia");
    if (!registroRes.ok) {
      const error = await registroRes.json();
      alert(error.error);
      return;
    }
    const registroData = await registroRes.json();
    setRegistroData(registroData);

    const intervaloRes = await fetch("/api/intervaloDia");
    if (!intervaloRes.ok) {
      const error = await intervaloRes.json();
      alert(error.error);
      return;
    }
    const intervaloData = await intervaloRes.json();
    setIntervalo(intervaloData);
  };

  console.log(registroData);

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
      <section className="flex flex-col items-center min-h-screen gap-5 p-10">
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
        <Registro
          registro={registroData.registro}
          intervalo={intervalo.intervalos}
        />
        <div className="bg-brown-main p-5 text-center rounded-2xl w-full">
          <h1 className="font-body text-3xl">Mis datos</h1>
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
