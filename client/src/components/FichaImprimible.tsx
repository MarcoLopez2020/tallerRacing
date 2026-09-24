interface FichaImprimibleProps {
  orden: any;
  detalles: any[];
}

export default function FichaImprimible({ orden, detalles }: FichaImprimibleProps) {
  if (!orden) return null;

  return (
    <div id="ficha-impresion" className="hidden print:block w-full max-w-[800px] mx-auto text-black font-sans text-xs bg-white">
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
          <div className="mt-1 inline-block border-2 border-red-600 px-3 py-0.5 rounded bg-red-50 text-red-700 font-black text-sm">
            N.° {orden.numero_orden}
          </div>
        </div>
      </div>

      {/* Fechas */}
      <div className="flex justify-end gap-6 mb-2 text-[11px]">
        <p><span className="font-bold">Fecha Ingreso:</span> {orden.fecha_ingreso}</p>
        <p><span className="font-bold">Fecha Entrega Estimada:</span> {orden.fecha_entrega_estimada || 'Por coordinar'}</p>
      </div>

{/* 1. Datos del Cliente */}
      <div className="border border-gray-400 rounded p-2.5 mb-2.5">
        <h2 className="font-black text-[10px] uppercase bg-gray-100 p-1 mb-1.5 border-b border-gray-300">
          1. Datos del Cliente
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
          <p><span className="font-bold">Nombre / Razón Social:</span> {orden.cliente?.nombre_completo || orden.cliente?.nombre || 'S/N'}</p>
          <p><span className="font-bold">Cédula / RUC:</span> {orden.cliente?.num_documento || orden.cliente?.cedula || orden.cliente?.ruc || 'S/N'}</p>
          <p><span className="font-bold">Teléfono:</span> {orden.cliente?.telefono || 'S/N'}</p>
          <p><span className="font-bold">Ciudad:</span> {orden.cliente?.ciudad || 'Patate'}</p>
          <p><span className="font-bold">Dirección:</span> {orden.cliente?.direccion || 'N/A'}</p>
          <p><span className="font-bold">Contacto Emergencia:</span> {orden.cliente?.contacto_emergencia || orden.cliente?.telefono_emergencia || 'N/A'}</p>
        </div>
      </div>

      {/* 2. Datos del Vehículo */}
      <div className="border border-gray-400 rounded p-2.5 mb-2.5">
        <h2 className="font-black text-[10px] uppercase bg-gray-100 p-1 mb-1.5 border-b border-gray-300">
          2. Datos del Vehículo ({orden.vehiculo?.tipo_vehiculo || 'Vehículo'})
        </h2>
        <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-[11px]">
          <p><span className="font-bold">Marca:</span> {orden.vehiculo?.marca || 'N/A'}</p>
          <p><span className="font-bold">Modelo:</span> {orden.vehiculo?.modelo || 'N/A'}</p>
          <p><span className="font-bold">Año:</span> {orden.vehiculo?.anio || orden.vehiculo?.año || 'N/A'}</p>
          <p><span className="font-bold">Color:</span> {orden.vehiculo?.color || 'N/A'}</p>
          <p><span className="font-bold">Placa / Serie:</span> {orden.vehiculo?.identificador || orden.vehiculo?.placa || 'N/A'}</p>
          <p><span className="font-bold">Kilometraje / Uso:</span> {orden.vehiculo?.kilometraje_actual || orden.vehiculo?.kilometraje || orden.kilometraje_ingreso || 'N/A'}</p>
        </div>
      </div>

      {/* 3. Diagnóstico */}
      <div className="border border-gray-400 rounded p-2.5 mb-2.5">
        <h2 className="font-black text-[10px] uppercase bg-gray-100 p-1 mb-1 border-b border-gray-300">
          3. Diagnóstico / Trabajos Solicitados
        </h2>
        <p className="min-h-[30px] text-[11px] text-gray-800">{orden.diagnostico_cliente || 'Sin observaciones registradas.'}</p>
      </div>

      {/* 4. Trabajos Realizados y Repuestos */}
      <div className="border border-gray-400 rounded p-2.5 mb-3">
        <h2 className="font-black text-[10px] uppercase bg-gray-100 p-1 mb-1.5 border-b border-gray-300">
          4. Trabajos Realizados y Repuestos / Material Utilizado
        </h2>
        <table className="w-full text-left border-collapse text-[10px]">
          <thead>
            <tr className="border-b border-gray-400 bg-gray-100">
              <th className="py-1 px-2">Tipo</th>
              <th className="py-1 px-2">Descripción</th>
              <th className="py-1 px-2 text-center w-12">Cant.</th>
              <th className="py-1 px-2 text-right w-20">V. Unit</th>
              <th className="py-1 px-2 text-right w-20">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {detalles && detalles.length > 0 ? (
              detalles.map((d) => (
                <tr key={d.id}>
                  <td className="py-1 px-2">{d.es_repuesto ? 'Repuesto' : 'Mano Obra'}</td>
                  <td className="py-1 px-2">{d.descripcion}</td>
                  <td className="py-1 px-2 text-center">{d.cantidad}</td>
                  <td className="py-1 px-2 text-right">${Number(d.precio_unitario).toFixed(2)}</td>
                  <td className="py-1 px-2 text-right font-bold">${Number(d.subtotal).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-2 text-center text-gray-400">Sin detalles registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Resumen Financiero y Firmas */}
      <div className="grid grid-cols-2 gap-4 items-end mt-2">
        {/* Firmas */}
        <div className="border border-gray-400 rounded p-3">
          <p className="text-[9px] text-gray-600 mb-8 italic">
            El cliente autoriza la realización de los trabajos descritos en la presente orden de trabajo.
          </p>
          <div className="grid grid-cols-2 gap-4 text-center text-[10px]">
            <div className="border-t border-gray-400 pt-1">Firma del cliente</div>
            <div className="border-t border-gray-400 pt-1">Firma del técnico</div>
          </div>
        </div>

        {/* Costos */}
        <div className="border border-gray-400 rounded p-2.5 text-[11px] space-y-1">
          <div className="flex justify-between">
            <span>Mano de obra:</span>
            <span className="font-semibold">${Number(orden.total_mano_obra || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Repuestos:</span>
            <span className="font-semibold">${Number(orden.total_repuestos || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Otros:</span>
            <span className="font-semibold">${Number(orden.otros_costos || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-1 font-bold text-xs">
            <span>TOTAL:</span>
            <span>${Number(orden.total || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-emerald-700 font-semibold">
            <span>Abono:</span>
            <span>${Number(orden.abono || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-400 pt-1 font-black text-sm text-red-600">
            <span>SALDO PENDIENTE:</span>
            <span>${Number(orden.saldo || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="text-center mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
        Más que un taller, somos tu aliado en el camino
      </div>
    </div>
  );
}