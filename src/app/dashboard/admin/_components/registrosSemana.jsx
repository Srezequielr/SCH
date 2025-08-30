"use client";
import { useEffect, useState } from "react";
import Registro from "../../user/_components/registro";
import { Icon } from "@iconify/react";

export default function RegistrosSemana({ dni_empleado }) {
  const [registrosSemana, setRegistrosSemana] = useState(null);

  const getISOWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return week;
  };

  const fetchData = async (week) => {
    const res = await fetch("/api/admin/getRegistrosSemana", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ semana: week, dni_empleado: dni_empleado }),
    });
    if (!res.ok) {
      const error = await res.json();
      alert(error.error);
      return;
    }
    const data = await res.json();

    setRegistrosSemana(data.registro);
  };

  useEffect(() => {
    const week = getISOWeekNumber(new Date());
    fetchData(week);
  }, []);

  if (!registrosSemana) {
    return (
      <div className="flex items-center justify-center">
        <Icon icon="mdi:loading" className="animate-spin text-7xl" />
      </div>
    );
  }

  if (registrosSemana.length == 0) {
    return (
      <div className="bg-brown-main p-5 my-2 w-full rounded-2xl">
        <p className="font-body bg-background p-2 w-full my-2 rounded-2xl text-center whitespace-pre-line">
          No hay registros cargados esta semana.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center rounded-2xl w-full">
      {registrosSemana.map((registro) => (
        <Registro key={registro.id} registro={registro} />
      ))}
    </div>
  );
}
