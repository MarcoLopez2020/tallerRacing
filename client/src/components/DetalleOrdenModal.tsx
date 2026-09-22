import { useState, useEffect } from 'react';
import { X, CheckCircle, Clock, Truck, Save, Printer } from 'lucide-react';
import { supabase } from '../lib/supabase';
import FichaImprimible from './FichaImprimible';

interface DetalleOrdenModalProps {
  orden: any | null;
  isOpen: boolean;
  onClose: () => void;
  onOrdenActualizada: () => void;
}

export default function DetalleOrdenModal({ orden, isOpen, onClose, onOrdenActualizada }: DetalleOrdenModalProps) {
  const [detalles, setDetalles] = useState<any[]>([]);
  const [estado, setEstado] = useState(orden?.estado || 'Pendiente');
  const [abono, setAbono] = useState<number>(Number(orden?.abono || 0));
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (orden && isOpen) {
      setEstado(orden.estado);
      setAbono(Number(orden.abono || 0));

      supabase
        .from('orden_detalles')
        .select('*')
        .eq('orden_id', orden.id)
        .then(({ data, error }) => {
          if (!error && data) setDetalles(data);
        });
    }
  }, [orden, isOpen]);

  if (!isOpen || !orden) return null;

  const total = Number(orden.total || 0);
  const saldoPendiente = Math.max(0, total - Number(abono));

  const handleGuardarCambios = async () => {
    setGuardando(true);
    try {
      const { error } = await supabase
        .from('ordenes_trabajo')
        .update({
          estado,
          abono: Number(abono),
          saldo: saldoPendiente,
        })
        .eq('id', orden.id);

      if (error) throw error;

      onOrdenActualizada();
      onClose();
    } catch (err: any) {
      alert('Error actualizando la orden: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <>
      <FichaImprimible orden={orden} detalles={detalles} />

      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="bg-zinc-900 text-white p-5 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className="bg-red-600 px-2.5 py-1 rounded text-xs font-black">
                  {orden.numero_orden}
                </span>
                <h2 className="text-lg font-bold">Gestión de Orden de Trabajo</h2>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Ingreso: {orden.fecha_ingreso} | Entrega Est.: {orden.fecha_entrega_estimada || 'No definida'}
              </p>
            </div>
            <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Cliente</p>
                <p className="font-semibold text-gray-800">{orden.cliente?.nombre_completo}</p>
                <p className="text-xs text-gray-600">Tel: {orden.cliente?.telefono} • {orden.cliente?.ciudad}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Vehículo ({orden.vehiculo?.tipo_vehiculo})</p>
                <p className="font-semibold text-gray-800">{orden.vehiculo?.marca} {orden.vehiculo?.modelo} - {orden.vehiculo?.color}</p>
                <p className="text-xs text-gray-600">Placa/Serie: {orden.vehiculo?.identificador}</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Estado del Mantenimiento</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: 'Pendiente', val: 'Pendiente', icon: Clock, color: 'border-yellow-400 bg-yellow-50 text-yellow-800' },
                  { label: 'En Proceso', val: 'En Proceso', icon: Clock, color: 'border-blue-400 bg-blue-50 text-blue-800' },
                  { label: 'Terminado', val: 'Terminado', icon: CheckCircle, color: 'border-emerald-400 bg-emerald-50 text-emerald-800' },
                  { label: 'Entregado', val: 'Entregado', icon: Truck, color: 'border-zinc-400 bg-zinc-100 text-zinc-800' },
                ].map((est) => {
                  const IconComponent = est.icon;
                  const isSelected = estado === est.val;
                  return (
                    <button
                      key={est.val}
                      type="button"
                      onClick={() => setEstado(est.val)}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-bold transition cursor-pointer ${
                        isSelected ? est.color + ' ring-2 ring-red-500 shadow-sm' : 'border-gray-200 bg-white text-gray-600'
                      }`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                      {est.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-700 uppercase mb-3">Trabajos y Repuestos Realizados</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase border-b">
                    <tr>
                      <th className="p-2">Tipo</th>
                      <th className="p-2">Descripción</th>
                      <th className="p-2 text-center">Cant.</th>
                      <th className="p-2 text-right">V. Unit</th>
                      <th className="p-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {detalles.map((d) => (
                      <tr key={d.id}>
                        <td className="p-2">
                          <span className={`px-1.5 py-0.5 rounded font-semibold ${d.es_repuesto ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                            {d.es_repuesto ? 'Repuesto' : 'Mano Obra'}
                          </span>
                        </td>
                        <td className="p-2 font-medium text-gray-800">{d.descripcion}</td>
                        <td className="p-2 text-center">{d.cantidad}</td>
                        <td className="p-2 text-right">${Number(d.precio_unitario).toFixed(2)}</td>
                        <td className="p-2 text-right font-bold text-gray-800">${Number(d.subtotal).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <button
                type="button"
                onClick={handleImprimir}
                className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Imprimir Ficha Oficial
              </button>

              <div className="w-full md:w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Total Facturado:</span>
                  <span className="font-bold text-gray-800">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Abono Actualizado:</span>
                  <input
                    type="number"
                    step="0.50"
                    value={abono}
                    onChange={(e) => setAbono(Number(e.target.value))}
                    className="w-20 border border-gray-300 rounded p-1 text-right text-xs bg-white font-bold text-emerald-700 focus:outline-none"
                  />
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-1 text-sm font-black text-red-600">
                  <span>Saldo por Cobrar:</span>
                  <span>${saldoPendiente.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded-lg cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handleGuardarCambios}
              disabled={guardando}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {guardando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}