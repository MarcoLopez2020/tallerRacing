import { useState } from 'react';
import { Search, Bike, Wrench, Calendar, CheckCircle2, History } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function HistorialVehiculo() {
  const [identificador, setIdentificador] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [vehiculo, setVehiculo] = useState<any | null>(null);
  const [ordenesHistorial, setOrdenesHistorial] = useState<any[]>([]);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identificador.trim()) return;

    setBuscando(true);
    setBusquedaRealizada(true);

    try {
      // 1. Buscar vehículo por Placa o Serie del Cuadro
      const { data: veh, error: errVeh } = await supabase
        .from('vehiculos')
        .select(`
          *,
          cliente:clientes(nombre_completo, telefono, email, ciudad)
        `)
        .ilike('identificador', identificador.trim())
        .maybeSingle();

      if (errVeh) throw errVeh;
      setVehiculo(veh);

      // 2. Si el vehículo existe, traer todas sus órdenes con sus detalles
      if (veh) {
        const { data: ots, error: errOT } = await supabase
          .from('ordenes_trabajo')
          .select(`
            *,
            orden_detalles(*)
          `)
          .eq('vehiculo_id', veh.id)
          .order('fecha_ingreso', { ascending: false });

        if (errOT) throw errOT;
        setOrdenesHistorial(ots || []);
      } else {
        setOrdenesHistorial([]);
      }
    } catch (err: any) {
      alert('Error consultando historial: ' + err.message);
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Historial Clínico de Vehículos</h2>
        <p className="text-gray-500 text-sm">
          Consulte la hoja de vida de mantenimientos por número de placa o serie de cuadro
        </p>
      </div>

      {/* Buscador */}
      <form onSubmit={handleBuscar} className="flex gap-3 max-w-xl">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Ingrese Placa (ej: HI-345Q) o Serie de Cuadro..."
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm uppercase focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={buscando}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition disabled:opacity-50 cursor-pointer"
        >
          {buscando ? 'Buscando...' : 'Buscar Historial'}
        </button>
      </form>

      {/* Resultados */}
      {busquedaRealizada && (
        <>
          {vehiculo ? (
            <div className="space-y-6">
              {/* Resumen del Vehículo y Propietario */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                    {vehiculo.tipo_vehiculo === 'Motocicleta' ? (
                      <Wrench className="w-8 h-8" />
                    ) : (
                      <Bike className="w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-gray-900">
                        {vehiculo.marca} {vehiculo.modelo} ({vehiculo.anio || 'Año N/A'})
                      </h3>
                      <span className="text-xs font-mono font-bold bg-zinc-900 text-white px-2 py-0.5 rounded">
                        {vehiculo.identificador}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Color: {vehiculo.color} • Kilometraje registrado: {vehiculo.kilometraje_actual || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6 text-sm">
                  <span className="text-xs font-bold text-gray-400 uppercase block">Propietario</span>
                  <p className="font-bold text-gray-800">{vehiculo.cliente?.nombre_completo}</p>
                  <p className="text-xs text-gray-500">{vehiculo.cliente?.telefono} • {vehiculo.cliente?.ciudad}</p>
                </div>
              </div>

              {/* Timeline de Órdenes */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-red-600" />
                  Mantenimientos Realizados ({ordenesHistorial.length})
                </h4>

                {ordenesHistorial.length === 0 ? (
                  <p className="text-gray-400 text-sm">No existen órdenes registradas para este vehículo.</p>
                ) : (
                  <div className="space-y-4">
                    {ordenesHistorial.map((ot) => (
                      <div
                        key={ot.id}
                        className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4"
                      >
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-sm bg-zinc-100 px-2.5 py-1 rounded text-zinc-800">
                              {ot.numero_orden}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" /> {ot.fecha_ingreso}
                            </span>
                            <span className="text-xs text-gray-600 font-medium">
                              Servicio: {ot.tipo_servicio}
                            </span>
                          </div>
                          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {ot.estado}
                          </span>
                        </div>

                        {ot.diagnostico_cliente && (
                          <div className="text-xs bg-gray-50 p-3 rounded-lg text-gray-700">
                            <span className="font-bold">Diagnóstico / Motivo:</span> {ot.diagnostico_cliente}
                          </div>
                        )}

                        {/* Detalle de repuestos y manos de obra */}
                        <div className="text-xs">
                          <span className="font-bold text-gray-500 uppercase block mb-1">
                            Repuestos y Trabajos Aplicados:
                          </span>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {ot.orden_detalles?.map((det: any) => (
                              <li key={det.id} className="flex justify-between bg-zinc-50 px-3 py-1.5 rounded">
                                <span className="text-gray-700">
                                  {det.cantidad}x {det.descripcion}
                                </span>
                                <span className="font-bold text-gray-900">${Number(det.subtotal).toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex justify-end gap-4 text-xs pt-2 border-t border-gray-100">
                          <span className="text-gray-500">Mano de Obra: ${Number(ot.total_mano_obra || 0).toFixed(2)}</span>
                          <span className="text-gray-500">Repuestos: ${Number(ot.total_repuestos || 0).toFixed(2)}</span>
                          <span className="font-bold text-red-600 text-sm">Total: ${Number(ot.total || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
              No se encontró ningún vehículo con la placa o serie "{identificador}".
            </div>
          )}
        </>
      )}
    </div>
  );
}