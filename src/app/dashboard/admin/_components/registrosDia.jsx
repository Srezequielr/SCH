import Registro from "./registro";

function estructurarDatos(empleados, registros, intervalos) {
  // 1. Filtrar solo registros válidos (que pertenezcan a empleados existentes)
  const registrosValidos = registros.filter((registro) =>
    empleados.some((emp) => emp.dni === registro.dni_empleado)
  );

  // 2. Crear mapa de intervalos por id_registro
  const intervalosPorRegistro = intervalos.reduce((map, intervalo) => {
    if (!map[intervalo.id_registro]) map[intervalo.id_registro] = [];
    map[intervalo.id_registro].push(intervalo);
    return map;
  }, {});

  // 3. Filtrar empleados que tienen registros y estructurar
  return empleados
    .filter((empleado) =>
      registrosValidos.some((reg) => reg.dni_empleado === empleado.dni)
    )
    .map((empleado) => {
      const registrosDelEmpleado = registrosValidos
        .filter((reg) => reg.dni_empleado === empleado.dni)
        .map((registro) => ({
          ...registro,
          intervalos: intervalosPorRegistro[registro.id] || [],
        }));

      return {
        ...empleado,
        registros: registrosDelEmpleado,
      };
    });
}

export default function RegistrosDia({ empleados, registros, intervalos }) {
  empleados = estructurarDatos(
    empleados,
    registros.registros,
    intervalos.intervalos
  );

  if (!empleados.lenght) {
    return (
      <div className="bg-brown-main p-5 my-2 w-full rounded-2xl">
        <p className="font-body bg-background p-2 w-full my-2 rounded-2xl text-center whitespace-pre-line">
          Aun no hay ningun registros el dia de la fecha
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      {" "}
      {empleados.map((empleado, index) => {
        return <Registro empleado={empleado} key={index} />;
      })}
    </div>
  );
}
