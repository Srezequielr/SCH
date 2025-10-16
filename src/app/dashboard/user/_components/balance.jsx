import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import formatHorasTrabajo from "@/utils/formatHsTrabajo";

export default function BalanceSemana() {
  const [balance, setBalance] = useState(null);

  const fetchBalance = async () => {
    const res = await fetch("/api/user/getBalanceSemana");
    if (!res.ok) {
      const error = await res.json();
      alert(error.error);
      return;
    }
    const balanceData = await res.json();
    setBalance(balanceData);
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  if (!balance) {
    return (
      <div className="bg-brown-main my-2 w-full rounded-2xl p-5">
        <div className="font-body bg-background my-2 flex w-full justify-center rounded-2xl p-2">
          <Icon icon="mdi:loading" className="animate-spin text-7xl" />
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`${
          balance.balance.saldo_total == balance.balance.pagos_realizados
            ? "border-green-400"
            : "border-red-400"
        } bg-brown-main w-full rounded-2xl border-4 p-5`}
      >
        {balance.balance.id_empleado ? (
          <>
            <div className="mb-2 flex flex-row justify-between gap-2">
              <p className="font-body text-lg">
                Num. semana: {""}
                <span className="font-bold">{balance.balance.num_semana}</span>
              </p>
              <p className="font-body text-lg">
                Num. mes: {""}
                <span className="font-bold">{balance.balance.num_mes}</span>
              </p>
            </div>
            <hr />
            <div className="font-body bg-background mt-2 grid w-full grid-cols-3 items-center justify-around rounded-2xl p-2 text-center">
              <h2 className="text-lg leading-none">Horas trabajadas</h2>
              <h2 className="text-lg leading-none">Saldo a pagar</h2>
              <h2 className="text-lg leading-none">Saldo pagado</h2>

              <p className="font-body text-3xl">
                {formatHorasTrabajo(balance.balance.horas_totales)}
              </p>
              <p className="font-body text-3xl">
                {balance.balance.saldo_total}
              </p>
              <p className="font-body text-3xl">
                {balance.balance.pagos_realizados}
              </p>
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
    );
  }
}

// <div>
//   <div
//     className={`${
//       balance.saldo_total == balance.pagos_realizados
//         ? "border-green-400"
//         : "border-red-400"
//     } bg-brown-main mb-2 w-full rounded-2xl border-4 p-5`}
//   >
//     {balance.id_empleado ? (
//       <>
// <div className="mb-2 flex flex-row justify-between gap-2">
//   <p className="font-body text-lg">
//     Num. semana: {""}
//     <span className="font-bold">{balance.num_semana}</span>
//   </p>
//   <p className="font-body text-lg">
//     Num. mes: {""}
//     <span className="font-bold">{balance.num_mes}</span>
//   </p>
// </div>
// <hr />
//         <div className="font-body bg-background mt-2 grid w-full grid-cols-3 items-center justify-around rounded-2xl p-2 text-center">
//           <h2 className="text-lg leading-none">Horas trabajadas</h2>
//           <h2 className="text-lg leading-none">Saldo a pagar</h2>
//           <h2 className="text-lg leading-none">Saldo pagado</h2>

//           <p className="font-body text-2xl">
//             {formatHorasTrabajo(balance.horas_totales)}
//           </p>
//           <p className="font-body text-2xl">{balance.saldo_total}</p>
//           <p className="font-body text-2xl">{balance.pagos_realizados}</p>
//         </div>
//       </>
//     ) : (
//       <div className="">
//         <p className="font-body bg-background my-2 w-full rounded-2xl p-2 text-center whitespace-pre-line">
//           Aun no hay ningun registro en la chequera
//         </p>
//       </div>
//     )}
//   </div>
//   <div className="flex flex-col gap-2">
//     <button
//       onClick={setInputSueldo}
//       disabled={busttonDisabled}
//       className="button_2"
//     >
//       {loadingPago ? "Registrando pago..." : "Registrar pago"}
//     </button>
//     {!pagoInputDisabled ? (
//       <form
//         action=""
//         onSubmit={(event) => setPago(event, balance.num_semana)}
//       >
//         <div className="flex flex-row gap-1.5">
//           <input
//             type="number"
//             placeholder="Pago"
//             name="pago"
//             required
//             className="bg-background focus:outline-brown-detail w-full rounded-2xl text-center focus:outline-4 focus:outline-offset-2 focus:outline-solid"
//           />
//           <button type="submit" className="button_2">
//             Registrar pago
//           </button>
//         </div>
//       </form>
//     ) : null}
//   </div>
// </div>
