export default function Empleados({ empleados }) {
  const empleadosActivos = empleados.filter((emp) => emp.estado == "Activo");
  const empleadosInactivos = empleados.filter(
    (emp) => emp.estado == "Inactivo"
  );

  return (
    <div className="bg-brown-main p-5 text-center rounded-2xl w-full">
      <h3 className="font-body text-3xl">Mis Empleados</h3>
      <hr />
      <h2 className="font-body text-2xl my-2">Empleados activos</h2>
      {empleadosActivos.map((empleado, index) => {
        return (
          <div key={index} className="p-2 bg-background my-2 rounded-2xl">
            <p className="font-body font-bold">
              {empleado.apellido} {empleado.nombre}
            </p>
          </div>
        );
      })}

      <h2 className="font-body text-2xl my-2">Empleados inactivos</h2>
      {empleadosInactivos.map((empleado, index) => {
        return (
          <div key={index} className="p-2 bg-background my-2 rounded-2xl">
            <p className="font-body font-bold">
              {empleado.apellido} {empleado.nombre}
            </p>
          </div>
        );
      })}
    </div>
  );
}
