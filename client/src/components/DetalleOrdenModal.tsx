import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Printer, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import FichaImprimible from './FichaImprimible';

interface DetalleOrdenModalProps {
  orden: any | null;
  isOpen: boolean;
  onClose: () => void;
  onOrdenActualizada: () => void;
}

export default function DetalleOrdenModal({
  orden,
  isOpen,
  onClose,
  onOrdenActualizada,
}: DetalleOrdenModalProps) {
  if (!isOpen || !orden) return null;

  const [detalles, setDetalles] = useState<any[]>([]);
  const [productosDisponibles, setProductosDisponibles] = useState<any[]>([]);
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState('');
  const [cantidadNueva, setCantidadNueva] = useState(1);
  const [estadoActual, setEstadoActual] = useState(orden.estado);
  const [abonoActual, setAbonoActual] = useState(Number(orden.abono || 0));
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Cargar detalles frescos y catálogo
  const cargarDetalles = async () => {
    const { data, error } = await supabase
      .from('orden_detalles')
      .select('*')
      .eq('orden_id', orden.id);

    if (!error && data) {
      setDetalles(data);
    }
  };

  const cargarProductos = async () => {
    const { data } = await supabase
      .from('productos')
      .select('*')
      .order('nombre', { ascending: true });
    if (data) setProductosDisponibles(data);
  };

  useEffect(() => {
    if (orden) {
      setEstadoActual(orden.estado);
      setAbonoActual(Number(orden.abono || 0));
      cargarDetalles();
      cargarProductos();
    }
  }, [orden]);

  // 2. Recalcular totales en ordenes_trabajo
  const recalcularTotalesOrden = async (items: any[], nuevoAbono?: number) => {
    let repuestos = 0;
    let manoObra = 0;

    items.forEach((item) => {
      const sub = Number(item.subtotal || 0);
      if (item.tipo === 'Servicio') {
        manoObra += sub;
      } else {
        repuestos += sub;
      }
    });

    const totalGeneral = repuestos + manoObra;
    const abonoUsado = nuevoAbono !== undefined ? nuevoAbono : abonoActual;
    const nuevoSaldo = Math.max(0, totalGeneral - abonoUsado);

    await supabase
      .from('ordenes_trabajo')
      .update({
        total_repuestos: repuestos,
        total_mano_obra: manoObra,
        total: totalGeneral,
        abono: abonoUsado,
        saldo: nuevoSaldo,
      })
      .eq('id', orden.id);

    onOrdenActualizada();
  };

  // 3. Agregar un repuesto o mano de obra a la orden ya creada
  const handleAgregarItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoSeleccionadoId) return;

    const prod = productosDisponibles.find((p) => p.id === productoSeleccionadoId);
    if (!prod) return;

    setCargando(true);
    setErrorMsg('');

    try {
      const precioU = Number(prod.precio_venta || 0);
      const subtotalItem = precioU * cantidadNueva;

      // Si es un repuesto físico, validar stock
      if (prod.tipo === 'Producto') {
        if (prod.stock_actual < cantidadNueva) {
          throw new Error(`Stock insuficiente. Solo quedan ${prod.stock_actual} unidades.`);
        }

        // Descontar del inventario
        await supabase
          .from('productos')
          .update({ stock_actual: prod.stock_actual - cantidadNueva })
          .eq('id', prod.id);
      }

      // Insertar en orden_detalles
      const { data: nuevoDetalle, error: errInsert } = await supabase
        .from('orden_detalles')
        .insert({
          orden_id: orden.id,
          producto_id: prod.id,
          descripcion: prod.nombre,
          tipo: prod.tipo,
          cantidad: cantidadNueva,
          precio_unitario: precioU,
          subtotal: subtotalItem,
        })
        .select()
        .single();

      if (errInsert) throw errInsert;

      const nuevosItems = [...detalles, nuevoDetalle];
      setDetalles(nuevosItems);
      await recalcularTotalesOrden(nuevosItems);

      // Limpiar selección
      setProductoSeleccionadoId('');
      setCantidadNueva(1);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error agregando ítem');
    } finally {
      setCargando(false);
    }
  };

  // 4. Borrar un ítem de la orden ya creada
  const handleBorrarItem = async (detalleId: string, productoId: string | null, cantidad: number, tipo: string) => {
    if (!confirm('¿Desea eliminar este ítem de la orden?')) return;

    setCargando(true);
    setErrorMsg('');

    try {
      // Si era un repuesto físico, devolver existencias al inventario
      if (tipo === 'Producto' && productoId) {
        const prod = productosDisponibles.find((p) => p.id === productoId);
        if (prod) {
          await supabase
            .from('productos')
            .update({ stock_actual: prod.stock_actual + cantidad })
            .eq('id', productoId);
        }
      }

      // Eliminar de orden_detalles
      const { error: errDel } = await supabase
        .from('orden_detalles')
        .delete()
        .eq('id', detalleId);

      if (errDel) throw errDel;

      const itemsRestantes = detalles.filter((d) => d.id !== detalleId);
      setDetalles(itemsRestantes);
      await recalcularTotalesOrden(itemsRestantes);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error eliminando el ítem');
    } finally {
      setCargando(false);
    }
  };

  // 5. Cambiar Estado o Abono
  const handleGuardarCambiosGenerales = async () => {
    setCargando(true);
    try {
      await recalcularTotalesOrden(detalles, abonoActual);
      await supabase
        .from('ordenes_trabajo')
        .update({
          estado: estadoActual,
          abono: abonoActual,
        })
        .eq('id', orden.id);

      onOrdenActualizada();
      alert('Orden actualizada con éxito');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al actualizar orden');
    } finally {
      setCargando(false);
    }
  };

  const totalCalculado = detalles.reduce((acc, curr) => acc + Number(curr.subtotal || 0), 0);
  const saldoCalculado = Math.max(0, totalCalculado - abonoActual);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      {/* Corregido */}
      <div className="hidden print:block">
        <FichaImprimible
          orden={{ ...orden, total: totalCalculado, saldo: saldoCalculado, abono: abonoActual, estado: estadoActual }}
          detalles={detalles}
        />
      </div>
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden print:hidden my-auto">
        {/* Cabecera Modal */}
        <div className="bg-zinc-900 text-white px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-black bg-red-600 px-2.5 py-1 rounded">
              {orden.numero_orden}
            </span>
            <div>
              <h3 className="font-bold text-sm md:text-base leading-tight">
                {orden.cliente?.nombre_completo || 'Cliente'}
              </h3>
              <p className="text-xs text-zinc-400">
                {orden.vehiculo?.marca} {orden.vehiculo?.modelo} • Placa: {orden.vehiculo?.identificador}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-xs px-3 py-1.5 rounded-lg border border-zinc-700 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </button>
            <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
             <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Formulario para agregar repuesto o mano de obra adicional */}
          <form onSubmit={handleAgregarItem} className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200">
            <label className="text-xs font-bold text-zinc-700 block mb-2 uppercase">
              Agregar Repuesto o Servicio a esta Orden
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={productoSeleccionadoId}
                onChange={(e) => setProductoSeleccionadoId(e.target.value)}
                className="flex-1 text-xs border border-zinc-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Seleccione repuesto o mano de obra...</option>
                {productosDisponibles.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.tipo === 'Servicio' ? 'SERVICIO' : `STOCK: ${p.stock_actual}`}] {p.nombre} - ${Number(p.precio_venta).toFixed(2)}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={cantidadNueva}
                onChange={(e) => setCantidadNueva(Math.max(1, Number(e.target.value)))}
                className="w-20 text-xs border border-zinc-300 rounded-lg p-2 bg-white text-center font-bold"
              />

              <button
                type="submit"
                disabled={cargando || !productoSeleccionadoId}
                className="flex items-center justify-center gap-1 bg-zinc-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-lg transition disabled:opacity-50 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Agregar
              </button>
            </div>
          </form>

          {/* Listado de Ítems actuales */}
          <div>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Repuestos y Servicios Cargados ({detalles.length})
            </h4>
            {detalles.length === 0 ? (
              <p className="text-xs text-zinc-400 italic">No hay ítems registrados en esta orden aún.</p>
            ) : (
              <div className="border border-zinc-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-100 text-zinc-700 uppercase font-semibold">
                    <tr>
                      <th className="p-2.5">Descripción</th>
                      <th className="p-2.5 text-center">Cant.</th>
                      <th className="p-2.5 text-right">P. Unit</th>
                      <th className="p-2.5 text-right">Subtotal</th>
                      <th className="p-2.5 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {detalles.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50">
                        <td className="p-2.5 font-medium text-zinc-800">
                          {item.descripcion}
                          <span className="text-[10px] text-zinc-400 block">{item.tipo}</span>
                        </td>
                        <td className="p-2.5 text-center font-bold">{item.cantidad}</td>
                        <td className="p-2.5 text-right font-mono">${Number(item.precio_unitario).toFixed(2)}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-zinc-900">
                          ${Number(item.subtotal).toFixed(2)}
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleBorrarItem(item.id, item.producto_id, item.cantidad, item.tipo)}
                            className="p-1 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                            title="Eliminar ítem"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Control de Estado, Abono y Saldos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
            <div>
              <label className="text-[11px] font-bold text-zinc-600 block mb-1">Estado de la Orden</label>
              <select
                value={estadoActual}
                onChange={(e) => setEstadoActual(e.target.value)}
                className="w-full text-xs font-bold border border-zinc-300 rounded-lg p-2 bg-white"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Terminado">Terminado</option>
                <option value="Entregado">Entregado</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-600 block mb-1">Abono del Cliente ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={abonoActual}
                onChange={(e) => setAbonoActual(Math.max(0, Number(e.target.value)))}
                className="w-full text-xs font-bold border border-zinc-300 rounded-lg p-2 bg-white"
              />
            </div>
          </div>

          {/* Resumen Total */}
          <div className="flex justify-between items-center bg-zinc-900 text-white p-4 rounded-xl">
            <div>
              <span className="text-[11px] text-zinc-400 block">Total Liquidación</span>
              <span className="text-xl font-black font-mono">${totalCalculado.toFixed(2)}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-zinc-400 block">Saldo por Cobrar</span>
              <span className="text-xl font-black font-mono text-red-400">${saldoCalculado.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="bg-zinc-100 px-5 py-3 flex justify-end gap-2 border-t border-zinc-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-200 rounded-lg transition"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleGuardarCambiosGenerales}
            disabled={cargando}
            className="flex items-center gap-1 px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {cargando ? 'Actualizando...' : 'Guardar Estado y Totales'}
          </button>
        </div>
      </div>
    </div>
  );
}