"use client";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Empleados from "./_components/empleados";

export default function admin() {
  const [userData, setUserData] = useState(null);
  const [empleados, setEmpleados] = useState(null);
  const fechaActual = new Date();
  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth() + 1;
  const dia = fechaActual.getDate();

  const fetchData = async () => {
    const resUser = await fetch("/api/user");
    if (!resUser.ok) {
      const error = await resUser.json();
      alert(error.error);
      return;
    }
    const userData = await resUser.json();
    setUserData(userData);

    const resEmpleados = await fetch("/api/empleados");
    if (!resEmpleados.ok) {
      const error = await resEmpleados.json();
      alert(error.error);
      return;
    }
    const empleadosData = await resEmpleados.json();

    setEmpleados(empleadosData.empleados);
  };

  useEffect(() => {
    fetchData();
    // const interval = setInterval(() => {
    //   fetchData();
    // }, 60000); // Actualiza cada minuto
  }, []);

  if (!userData || !empleados) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icon icon="mdi:loading" className="animate-spin text-7xl" />
      </div>
    );
  } else
    return (
      <section className="flex flex-col items-center min-h-screen gap-5 p-10">
        <div>
          <div className="flex items-center justify-between bg-brown-main p-2 text-center rounded-2xl mb-2">
            <p className="font-body font-bold">{`${dia}/${mes}/${año}`}</p>
            <p className="font-body">Dashboard</p>
          </div>
          <h1 className="font-title text-4xl">
            Bienvenido {userData.usuario.nombre}!
          </h1>
        </div>
        <Empleados empleados={empleados} />
      </section>
    );
}
