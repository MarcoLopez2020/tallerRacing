export default function FichaEnBlancoImprimible() {
  return (
    <div className="print-only block w-full max-w-[800px] mx-auto text-black font-sans text-xs bg-white p-4">
      {/* Encabezado con Logo y Membrete */}
      <div className="border-b-2 border-black pb-2 mb-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="/logoZona.jpg"
            alt="Logo Zona Racing"
            className="w-14 h-14 object-contain rounded border border-gray-300 p-0.5"
          />
          <div>
            <h1 className="text-2xl font-black tracking-wider text-black">ZONA RACING</h1>
            <p className="text-[11px] font-bold text-gray-800 uppercase tracking-wide">
              Mecánica de Motocicletas y Bicicletas • Repuestos y Accesorios
            </p>
            <p className="text-[10px] text-gray-600">Patate • Tungurahua • Ecuador | Tel / WhatsApp: 0979240939</p>
          </div>
        </div>
        <div className="text-right border-2 border-black rounded p-2 bg-gray-50">
          <span className="block text-[10px] font-bold uppercase text-gray-600">Hoja de Trabajo</span>
          <span className="text-sm font-black font-mono">N.° ORDEN: _________</span>
        </div>
      </div>

      {/* Fechas de recepción y entrega */}
      <div className="flex justify-between items-center border border-black rounded px-3 py-1.5 mb-2.5 bg-gray-50 text-[11px]">
        <div>
          <strong>Fecha Recepción:</strong> _____ / _____ / 202___ &nbsp;&nbsp;&nbsp;&nbsp;
          <strong>Hora:</strong> ____ : ____
        </div>
        <div>
          <strong>Fecha Estimada Entrega:</strong> _____ / _____ / 202___
        </div>
      </div>

      {/* 1. Datos del Cliente */}
      <div className="border border-black rounded p-2.5 mb-2.5">
        <h2 className="font-bold text-[10px] uppercase bg-gray-200 px-2 py-0.5 mb-2 border border-gray-400">
          1. DATOS DEL CLIENTE
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px]">
          <div><span className="font-bold">Cliente / Razón Social:</span> ____________________________________</div>
          <div><span className="font-bold">Cédula / RUC:</span> _____________________________</div>
          <div><span className="font-bold">Teléfono / WhatsApp:</span> _________________________________</div>
          <div><span className="font-bold">Ciudad / Sector:</span> __________________________</div>
          <div className="col-span-2"><span className="font-bold">Dirección de Domicilio:</span> ____________________________________________________________________</div>
        </div>
      </div>

      {/* 2. Datos del Vehículo */}
      <div className="border border-black rounded p-2.5 mb-2.5">
        <div className="flex justify-between items-center bg-gray-200 px-2 py-0.5 mb-2 border border-gray-400">
          <h2 className="font-bold text-[10px] uppercase">
            2. DATOS DEL VEHÍCULO
          </h2>
          <div className="flex gap-4 text-[10px] font-bold">
            <span>[ &nbsp; ] MOTOCICLETA</span>
            <span>[ &nbsp; ] BICICLETA</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-[11px]">
          <div><span className="font-bold">Marca:</span> _______________________</div>
          <div><span className="font-bold">Modelo:</span> ______________________</div>
          <div><span className="font-bold">Año:</span> ____________</div>
          <div><span className="font-bold">Color:</span> _______________________</div>
          <div><span className="font-bold">Placa / Serie:</span> _________________</div>
          <div><span className="font-bold">Kilometraje:</span> _________ km</div>
        </div>
      </div>

      {/* 3. Motivo de Ingreso y Diagnóstico */}
      <div className="border border-black rounded p-2.5 mb-2.5">
        <h2 className="font-bold text-[10px] uppercase bg-gray-200 px-2 py-0.5 mb-1.5 border border-gray-400">
          3. MOTIVO DE INGRESO / FALLAS REPORTADAS POR EL CLIENTE
        </h2>
        <div className="h-14 space-y-3.5 pt-1">
          <div className="border-b border-gray-400 border-dashed w-full h-3"></div>
          <div className="border-b border-gray-400 border-dashed w-full h-3"></div>
          <div className="border-b border-gray-400 border-dashed w-full h-3"></div>
        </div>
      </div>

      {/* 4. Tabla de Repuestos y Trabajos a Mano */}
      <div className="border border-black rounded p-2.5 mb-2.5">
        <h2 className="font-bold text-[10px] uppercase bg-gray-200 px-2 py-0.5 mb-1.5 border border-gray-400">
          4. REPUESTOS, INSUMOS Y TRABAJOS APLICADOS (LLENAR EN TALLER)
        </h2>
        <table className="w-full text-left border-collapse text-[10px]">
          <thead>
            <tr className="border-b border-black bg-gray-100">
              <th className="py-1 px-2 border-r border-black w-10 text-center">Cant.</th>
              <th className="py-1 px-2 border-r border-black">Descripción del Repuesto o Mano de Obra</th>
              <th className="py-1 px-2 border-r border-black text-right w-20">V. Unit ($)</th>
              <th className="py-1 px-2 text-right w-24">Subtotal ($)</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <tr key={i} className="border-b border-gray-300 h-6">
                <td className="border-r border-black text-center text-gray-400"></td>
                <td className="border-r border-black"></td>
                <td className="border-r border-black text-right text-gray-400 pr-1">$</td>
                <td className="text-right text-gray-400 pr-1">$</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. Liquidación Financiera y Firmas */}
      <div className="grid grid-cols-2 gap-4 items-end">
        {/* Términos y Firmas */}
        <div className="border border-black rounded p-2.5">
          <p className="text-[9px] text-gray-600 mb-8 leading-tight italic">
            El cliente declara conocer y autorizar los trabajos descritos. Todo trabajo o repuesto adicional será coordinado previamente. No nos responsabilizamos por objetos de valor no inventariados.
          </p>
          <div className="grid grid-cols-2 gap-4 text-center text-[10px]">
            <div className="border-t border-black pt-1 font-bold">Firma del Cliente</div>
            <div className="border-t border-black pt-1 font-bold">Firma Técnico / Taller</div>
          </div>
        </div>

        {/* Resumen de Valores a Mano */}
        <div className="border border-black rounded p-2.5 text-[11px] space-y-1">
          <div className="flex justify-between border-b border-gray-300 pb-0.5">
            <span>Total Mano de Obra:</span>
            <span className="font-mono">$ ________________</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-0.5">
            <span>Total Repuestos:</span>
            <span className="font-mono">$ ________________</span>
          </div>
          <div className="flex justify-between border-b border-black pb-0.5 font-bold">
            <span>VALOR TOTAL:</span>
            <span className="font-mono">$ ________________</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-0.5">
            <span>Abono / Anticipo:</span>
            <span className="font-mono">$ ________________</span>
          </div>
          <div className="flex justify-between font-black text-xs pt-0.5">
            <span>SALDO A COBRAR:</span>
            <span className="font-mono">$ ________________</span>
          </div>
        </div>
      </div>

      <div className="text-center mt-3 text-[9px] text-gray-500 font-bold uppercase tracking-wider">
        ZONA RACING • Pasión y Compromiso en dos ruedas • Patate, Ecuador
      </div>
    </div>
  );
}