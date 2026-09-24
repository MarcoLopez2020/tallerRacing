export default function FichaEnBlancoImprimible() {
  return (
    <div id="ficha-blanco" className="hidden print:block w-full max-w-[800px] mx-auto text-black font-sans text-xs bg-white p-2">
      {/* Encabezado con Logo */}
      <div className="border-b-2 border-red-600 pb-2 mb-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="/logoZona.jpg"
            alt="Logo Zona Racing"
            className="w-16 h-16 object-contain rounded"
          />
          <div>
            <h1 className="text-2xl font-black tracking-wider text-red-600">ZONA RACING</h1>
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">
              Mecánica de Motocicletas y Bicicletas
            </p>
            <p className="text-[10px] text-gray-600">Tu vehículo, nuestra pasión • Repuestos y Servicio</p>
          </div>
        </div>
        <div className="text-right text-[11px] leading-tight text-gray-700">
          <p className="font-bold">Patate - Ecuador</p>
          <p>Tel: 0979240939</p>
          <div className="mt-1 border-2 border-dashed border-gray-400 px-3 py-1 rounded bg-gray-50 text-gray-500 font-bold text-xs">
            N.° ORDEN: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]
          </div>
        </div>
      </div>

      {/* Fechas */}
      <div className="flex justify-between items-center mb-2.5 text-[11px] bg-gray-50 p-2 border border-gray-300 rounded">
        <div>
          <span className="font-bold">Fecha de Recepción:</span> _____ / _____ / 202___ &nbsp;&nbsp;&nbsp;
          <span className="font-bold">Hora:</span> ____ : ____
        </div>
        <div>
          <span className="font-bold">Fecha Estimada de Entrega:</span> _____ / _____ / 202___
        </div>
      </div>

      {/* 1. Datos del Cliente */}
      <div className="border border-gray-400 rounded p-2 mb-2.5">
        <h2 className="font-black text-[10px] uppercase bg-gray-100 p-1 mb-1.5 border-b border-gray-300">
          1. Datos del Cliente
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
          <p><span className="font-bold">Cliente / Razón Social:</span> ____________________________________</p>
          <p><span className="font-bold">Cédula / RUC:</span> _____________________________</p>
          <p><span className="font-bold">Teléfono / WhatsApp:</span> _________________________________</p>
          <p><span className="font-bold">Ciudad / Sector:</span> __________________________</p>
          <p><span className="font-bold">Dirección:</span> ____________________________________________</p>
          <p><span className="font-bold">Contacto Emergencia:</span> ________________________</p>
        </div>
      </div>

      {/* 2. Datos del Vehículo */}
      <div className="border border-gray-400 rounded p-2 mb-2.5">
        <div className="flex justify-between items-center bg-gray-100 p-1 mb-1.5 border-b border-gray-300">
          <h2 className="font-black text-[10px] uppercase">
            2. Datos del Vehículo
          </h2>
          <div className="flex gap-4 text-[10px] font-bold">
            <label className="flex items-center gap-1">[ &nbsp; ] Motocicleta</label>
            <label className="flex items-center gap-1">[ &nbsp; ] Bicicleta</label>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-[11px]">
          <p><span className="font-bold">Marca:</span> _______________________</p>
          <p><span className="font-bold">Modelo:</span> ______________________</p>
          <p><span className="font-bold">Año:</span> ____________</p>
          <p><span className="font-bold">Color:</span> _______________________</p>
          <p><span className="font-bold">Placa / Serie:</span> _________________</p>
          <p><span className="font-bold">Km / Horas:</span> _________</p>
        </div>
      </div>

      {/* 3. Motivo de Ingreso y Diagnóstico Inicial */}
      <div className="border border-gray-400 rounded p-2 mb-2.5">
        <h2 className="font-black text-[10px] uppercase bg-gray-100 p-1 mb-1 border-b border-gray-300">
          3. Diagnóstico / Fallas Reportadas / Trabajos a Realizar
        </h2>
        <div className="h-16 border-b border-dashed border-gray-300 space-y-4 pt-1 text-[11px] text-gray-400">
          <div className="border-b border-gray-200 h-4"></div>
          <div className="border-b border-gray-200 h-4"></div>
          <div className="border-b border-gray-200 h-4"></div>
        </div>
      </div>

      {/* 4. Repuestos / Materiales / Mano de Obra para Anotar */}
      <div className="border border-gray-400 rounded p-2 mb-2.5">
        <h2 className="font-black text-[10px] uppercase bg-gray-100 p-1 mb-1 border-b border-gray-300">
          4. Registro de Repuestos y Mano de Obra Realizada
        </h2>
        <table className="w-full text-left border-collapse text-[10px]">
          <thead>
            <tr className="border-b border-gray-400 bg-gray-50 text-gray-700">
              <th className="py-1 px-2 w-12 text-center">Cant.</th>
              <th className="py-1 px-2">Descripción del Repuesto o Servicio Aplicado</th>
              <th className="py-1 px-2 text-right w-20">V. Unit</th>
              <th className="py-1 px-2 text-right w-24">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <tr key={i} className="h-5">
                <td className="border-r border-gray-200"></td>
                <td className="border-r border-gray-200"></td>
                <td className="border-r border-gray-200 text-right text-gray-300">$</td>
                <td className="text-right text-gray-300">$</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. Liquidación y Firmas */}
      <div className="grid grid-cols-2 gap-4 items-end mt-1">
        <div className="border border-gray-400 rounded p-2.5">
          <p className="text-[9px] text-gray-600 mb-9 italic">
            Autorizo la revisión y mano de obra necesaria para el vehículo detallado. El taller no se responsabiliza por objetos de valor no declarados en el inventario de ingreso.
          </p>
          <div className="grid grid-cols-2 gap-4 text-center text-[10px]">
            <div className="border-t border-gray-400 pt-1 font-bold">Firma del Cliente</div>
            <div className="border-t border-gray-400 pt-1 font-bold">Firma Técnico / Taller</div>
          </div>
        </div>

        <div className="border border-gray-400 rounded p-2 text-[11px] space-y-1">
          <div className="flex justify-between border-b border-gray-200 pb-0.5">
            <span>Total Mano de Obra:</span>
            <span className="font-mono text-gray-500">$ ____________</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-0.5">
            <span>Total Repuestos:</span>
            <span className="font-mono text-gray-500">$ ____________</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-0.5 font-bold">
            <span>VALOR TOTAL:</span>
            <span className="font-mono text-gray-800">$ ____________</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-0.5">
            <span>Abono / Anticipo:</span>
            <span className="font-mono text-gray-500">$ ____________</span>
          </div>
          <div className="flex justify-between font-black text-xs text-red-600 pt-0.5">
            <span>SALDO PENDIENTE:</span>
            <span className="font-mono">$ ____________</span>
          </div>
        </div>
      </div>

      <div className="text-center mt-3 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
        Zona Racing • Patate, Ecuador • Calidad y Seguridad en dos ruedas
      </div>
    </div>
  );
}