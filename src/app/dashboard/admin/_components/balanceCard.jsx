import formatHorasTrabajo from "@/utils/formatHsTrabajo";
import { useState } from "react";
import Swal from "sweetalert2";

export default function BalanceCard({ balance, onUpdate }) {
  const mainColor = "#A47864";
  const [busttonDisabled, setButtonDisabled] = useState(false);
  const [pagoInputDisabled, setPagoInputDisabled] = useState(true);
  const [loadingPago, setLoadingPago] = useState(false);

  const setPago = async (event) => {
    event.preventDefault();
    setLoadingPago(true);
    const pago = event.target.pago.value;
    setPagoInputDisabled(true);

    const res = await fetch("/api/admin/setPago", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_empleado: balance.id_empleado,
        pago: pago,
        num_sem: balance.num_semana,
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
    onUpdate();
  };

  const setInputSueldo = () => {
    setButtonDisabled(true);
    setPagoInputDisabled(false);
  };
  return (
    <div>
      <div
        className={`${
          balance.saldo_total == balance.pagos_realizados
            ? "border-green-400"
            : "border-red-400"
        } bg-brown-main mb-2 w-full rounded-2xl border-4 p-5`}
      >
        {balance.id_empleado ? (
          <>
            <div className="mb-2 flex flex-row justify-between gap-2">
              <p className="font-body text-lg">
                Num. semana: {""}
                <span className="font-bold">{balance.num_semana}</span>
              </p>
              <p className="font-body text-lg">
                Num. mes: {""}
                <span className="font-bold">{balance.num_mes}</span>
              </p>
            </div>
            <hr />
            <div className="font-body bg-background mt-2 grid w-full grid-cols-3 items-center justify-around rounded-2xl p-2 text-center">
              <h2 className="text-lg leading-none">Horas trabajadas</h2>
              <h2 className="text-lg leading-none">Saldo a pagar</h2>
              <h2 className="text-lg leading-none">Saldo pagado</h2>

              <p className="font-body text-2xl">
                {formatHorasTrabajo(balance.horas_totales)}
              </p>
              <p className="font-body text-2xl">{balance.saldo_total}</p>
              <p className="font-body text-2xl">{balance.pagos_realizados}</p>
            </div>
          </>
        ) : (
          <div className="">
            <p className="font-body bg-background my-2 w-full rounded-2xl p-2 text-center whitespace-pre-line">
              Aun no hay ningun registro en la chequera
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={setInputSueldo}
          disabled={busttonDisabled}
          className="button_2"
        >
          {loadingPago ? "Registrando pago..." : "Registrar pago"}
        </button>
        {!pagoInputDisabled ? (
          <form
            action=""
            onSubmit={(event) => setPago(event, balance.num_semana)}
          >
            <div className="flex flex-row gap-1.5">
              <input
                type="number"
                placeholder="Pago"
                name="pago"
                required
                className="bg-background focus:outline-brown-detail w-full rounded-2xl text-center focus:outline-4 focus:outline-offset-2 focus:outline-solid"
              />
              <button type="submit" className="button_2">
                Registrar pago
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}
