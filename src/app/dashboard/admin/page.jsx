"use client";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Empleados from "./_components/empleados";
import RegistrosDia from "./_components/registrosDia";

export default function admin() {
  const [userData, setUserData] = useState(null);
  const [empleados, setEmpleados] = useState(null);
  const [registros, setRegistros] = useState(null);
  const [intervalos, setIntervalos] = useState(null);
  const fechaActual = new Date();
  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth() + 1;
  const dia = fechaActual.getDate();

  const fetchData = async () => {
    const resUser = await fetch("/api/getUser");
    if (!resUser.ok) {
      const error = await resUser.json();
      alert(error.error);
      return;
    }
    const userData = await resUser.json();
    setUserData(userData);

    const resEmpleados = await fetch("/api/admin/getEmpleados");
    if (!resEmpleados.ok) {
      const error = await resEmpleados.json();
      alert(error.error);
      return;
    }
    const empleadosData = await resEmpleados.json();
    setEmpleados(empleadosData.empleados);

    const resRegistros = await fetch("/api/admin/getRegistrosDia");
    if (!resRegistros.ok) {
      const error = await resEmpleados.json();
      alert(error.error);
      return;
    }
    const registrosData = await resRegistros.json();
    setRegistros(registrosData);

    const resIntervalos = await fetch("/api/admin/getIntervalosDia");
    if (!resRegistros.ok) {
      const error = await resEmpleados.json();
      alert(error.error);
      return;
    }
    const intervalosData = await resIntervalos.json();
    setIntervalos(intervalosData);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 120000); 
  }, []);

  if (!userData || !empleados || !intervalos || !registros) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icon icon="mdi:loading" className="animate-spin text-7xl" />
      </div>
    );
  } else
    return (
      <section className="flex flex-col items-center min-h-screen gap-5 py-10 px-5">
        <div>
          <div className="flex items-center justify-between bg-brown-main p-2 text-center rounded-2xl mb-2">
            <p className="font-body font-bold">{`${dia}/${mes}/${año}`}</p>
            <p className="font-body">Dashboard</p>
          </div>
          <h1 className="font-title text-4xl text-center">
            Bienvenido {userData.usuario.nombre}!
          </h1>
        </div>
        <Empleados empleados={empleados} />
        <h1 className="font-title text-4xl">Registros del dia.</h1>
        <RegistrosDia
          empleados={empleados}
          registros={registros}
          intervalos={intervalos}
        />
      </section>
    );
}
