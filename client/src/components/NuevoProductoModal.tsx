import React, { useState } from 'react';
import { X, PackagePlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NuevoProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductoCreado: () => void;
}

export default function NuevoProductoModal({ isOpen, onClose, onProductoCreado }: NuevoProductoModalProps) {
  const [sku, setSku] = useState('');
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<'Producto' | 'Servicio'>('Producto');
  const [categoria, setCategoria] = useState<'Motocicleta' | 'Bicicleta' | 'Universal'>('Motocicleta');
  const [subcategoria, setSubcategoria] = useState('Lubricantes');
  const [stockActual, setStockActual] = useState<number>(1);
  const [stockMinimo, setStockMinimo] = useState<number>(1);
  const [precioCosto, setPrecioCosto] = useState<number>(0);
  const [precioVenta, setPrecioVenta] = useState<number>(0);
  const [guardando, setGuardando] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const { error } = await supabase.from('productos').insert({
        codigo_sku: sku.trim().toUpperCase(),
        nombre: nombre.trim(),
        tipo,
        categoria_vehiculo: categoria,
        subcategoria: subcategoria.trim(),
        stock_minimo: Number(stockMinimo),
        stock_actual: tipo === 'Servicio' ? 999 : Number(stockActual),
        precio_costo: Number(precioCosto),
        precio_venta: Number(precioVenta),
      });

      if (error) throw error;

      onProductoCreado();
      onClose();
    } catch (err: any) {
      alert('Error creando producto: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-zinc-900 text-white p-5 flex justify-between items-center border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <PackagePlus className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold">Nuevo Repuesto o Servicio</h2>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Código SKU *</label>
              <input
                type="text"
                placeholder="Ej: ACE-MOT-001"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm uppercase focus:ring-2 focus:ring-red-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white focus:outline-none"
              >
                <option value="Producto">Repuesto / Producto</option>
                <option value="Servicio">Mano de Obra / Servicio</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre / Descripción *</label>
            <input
              type="text"
              placeholder="Ej: Aceite Motul 7100 4T 10W40"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Categoría Vehículo</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white focus:outline-none"
              >
                <option value="Motocicleta">Motocicleta</option>
                <option value="Bicicleta">Bicicleta</option>
                <option value="Universal">Universal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Subcategoría</label>
              <input
                type="text"
                placeholder="Frenos, Lubricantes..."
                value={subcategoria}
                onChange={(e) => setSubcategoria(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none"
              />
            </div>
          </div>

          {tipo === 'Producto' && (
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Stock Inicial</label>
                <input
                  type="number"
                  min="0"
                  value={stockActual}
                  onChange={(e) => setStockActual(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Stock Mínimo</label>
                <input
                  type="number"
                  min="1"
                  value={stockMinimo}
                  onChange={(e) => setStockMinimo(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Precio Costo ($)</label>
              <input
                type="number"
                step="0.05"
                min="0"
                value={precioCosto}
                onChange={(e) => setPrecioCosto(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Precio Venta ($) *</label>
              <input
                type="number"
                step="0.05"
                min="0"
                value={precioVenta}
                onChange={(e) => setPrecioVenta(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm font-bold text-gray-800 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-50"
            >
              {guardando ? 'Guardando...' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}