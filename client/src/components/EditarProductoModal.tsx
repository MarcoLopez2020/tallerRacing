import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EditarProductoModalProps {
  producto: any | null;
  isOpen: boolean;
  onClose: () => void;
  onProductoActualizado: () => void;
}

export default function EditarProductoModal({
  producto,
  isOpen,
  onClose,
  onProductoActualizado,
}: EditarProductoModalProps) {
  if (!isOpen || !producto) return null;

  const [nombre, setNombre] = useState('');
  const [stockActual, setStockActual] = useState(0);
  const [stockMinimo, setStockMinimo] = useState(1);
  const [precioCosto, setPrecioCosto] = useState(0);
  const [precioVenta, setPrecioVenta] = useState(0);
  const [subcategoria, setSubcategoria] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre || '');
      setStockActual(producto.stock_actual ?? 0);
      setStockMinimo(producto.stock_minimo ?? 1);
      setPrecioCosto(producto.precio_costo ?? 0);
      setPrecioVenta(producto.precio_venta ?? 0);
      setSubcategoria(producto.subcategoria || '');
      setErrorMsg('');
    }
  }, [producto]);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setErrorMsg('');

    try {
      const { error } = await supabase
        .from('productos')
        .update({
          nombre,
          stock_actual: Number(stockActual),
          stock_minimo: Number(stockMinimo),
          precio_costo: Number(precioCosto),
          precio_venta: Number(precioVenta),
          subcategoria,
        })
        .eq('id', producto.id);

      if (error) throw error;

      onProductoActualizado();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al actualizar el producto');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="bg-zinc-900 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-base">Editar Repuesto / Servicio</h3>
            <p className="text-xs text-zinc-400 font-mono">{producto.codigo_sku}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleGuardar} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">Nombre / Descripción</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">Subcategoría</label>
            <input
              type="text"
              value={subcategoria}
              onChange={(e) => setSubcategoria(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="Ej: Lubricantes, Frenos, Transmisión"
            />
          </div>

          {producto.tipo === 'Producto' && (
            <div className="grid grid-cols-2 gap-3 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
              <div>
                <label className="text-[11px] font-bold text-zinc-600 block mb-1">Stock Actual</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stockActual}
                  onChange={(e) => setStockActual(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm font-bold border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-600 block mb-1">Stock Mínimo</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stockMinimo}
                  onChange={(e) => setStockMinimo(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm font-bold border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
            <div>
              <label className="text-[11px] font-bold text-zinc-600 block mb-1">Precio Costo ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={precioCosto}
                onChange={(e) => setPrecioCosto(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-sm font-bold border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-zinc-600 block mb-1">Precio Venta ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={precioVenta}
                onChange={(e) => setPrecioVenta(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-sm font-black text-red-600 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {guardando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}