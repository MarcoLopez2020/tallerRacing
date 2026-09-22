import { useState, useEffect } from 'react';
import { Wrench, Bike, ClipboardList, Package, Plus, Search } from 'lucide-react';
import { INVENTARIO_INICIAL, ORDENES_EJEMPLO } from './mocks/mockData';
import NuevaOrdenModal from './components/NuevaOrdenModal';

export default function App() {
  const [tab, setTab] = useState<'ordenes' | 'inventario'>('ordenes');
  const [busqueda, setBusqueda] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Inicializar estado con localStorage si existe, o usar datos mock
  const [ordenes, setOrdenes] = useState(() => {
    const guardadas = localStorage.getItem('zr_ordenes');
    return guardadas ? JSON.parse(guardadas) : ORDENES_EJEMPLO;
  });

  const [inventario, setInventario] = useState(() => {
    const guardado = localStorage.getItem('zr_inventario');
    return guardado ? JSON.parse(guardado) : INVENTARIO_INICIAL;
  });

  useEffect(() => {
    localStorage.setItem('zr_ordenes', JSON.stringify(ordenes));
  }, [ordenes]);

  useEffect(() => {
    localStorage.setItem('zr_inventario', JSON.stringify(inventario));
  }, [inventario]);

  const handleGuardarOrden = (nuevaOrden: any) => {
    // 1. Agregar la orden
    setOrdenes([nuevaOrden, ...ordenes]);

    // 2. Descontar stock de los repuestos utilizados automáticamente
    nuevaOrden.items.forEach((item: any) => {
      if (item.tipo === 'Repuesto') {
        setInventario((prev: any[]) =>
          prev.map((prod) =>
            prod.nombre === item.descripcion
              ? { ...prod, stock: Math.max(0, prod.stock - item.cantidad) }
              : prod
          )
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Barra Lateral */}
      <aside className="w-64 bg-zinc-900 text-white flex flex-col">
        <div className="p-5 border-b border-zinc-800 flex items-center gap-3">
          <Wrench className="text-red-500 w-7 h-7" />
          <div>
            <h1 className="font-black text-lg tracking-wider">ZONA RACING</h1>
            <p className="text-xs text-zinc-400">Motos y Bicicletas</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setTab('ordenes')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition cursor-pointer ${
              tab === 'ordenes' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            Órdenes de Trabajo
          </button>
          <button
            onClick={() => setTab('inventario')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition cursor-pointer ${
              tab === 'inventario' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <Package className="w-5 h-5" />
            Inventario / Repuestos
          </button>
        </nav>
      </aside>

      {/* Contenido Dinámico */}
      <main className="flex-1 p-8 overflow-y-auto">
        {tab === 'ordenes' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Órdenes de Trabajo</h2>
                <p className="text-gray-500 text-sm">Control de recepciones y mantenimientos en taller</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm transition cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Nueva Orden (Ficha)
              </button>
            </div>

            {/* Listado de órdenes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {ordenes.map((ot: any) => (
                <div key={ot.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded">
                        {ot.id}
                      </span>
                      <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                        {ot.estado}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-800 text-lg">{ot.cliente.nombre}</h3>
                    <p className="text-xs text-gray-500 mb-3">{ot.cliente.telefono} • {ot.cliente.ciudad}</p>

                    <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3 text-sm text-gray-700 mb-3">
                      {ot.vehiculo.tipo === 'Motocicleta' ? (
                        <Wrench className="w-4 h-4 text-red-500 flex-shrink-0" />
                      ) : (
                        <Bike className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-xs text-gray-800">
                          {ot.vehiculo.marca} {ot.vehiculo.modelo} ({ot.vehiculo.color})
                        </p>
                        <p className="text-xs text-gray-400">
                          Placa/Serie: {ot.vehiculo.placa || ot.vehiculo.placaSerie}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-sm">
                    <div>
                      <span className="text-xs text-gray-400 block">Saldo pendiente</span>
                      <span className="font-bold text-red-600">
                        ${(ot.resumenCostos?.saldo ?? ot.saldo).toFixed(2)}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500 font-medium">
                      Total: ${(ot.resumenCostos?.total ?? ot.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Inventario y Repuestos</h2>
                <p className="text-gray-500 text-sm">Stock actual de lubricantes, refacciones y accesorios</p>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por repuesto o SKU..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Tabla de Repuestos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3">SKU</th>
                    <th className="px-6 py-3">Descripción</th>
                    <th className="px-6 py-3">Categoría</th>
                    <th className="px-6 py-3 text-center">Stock</th>
                    <th className="px-6 py-3 text-right">Precio Venta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inventario
                    .filter(
                      (item: any) =>
                        item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                        item.sku.toLowerCase().includes(busqueda.toLowerCase())
                    )
                    .map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-xs text-zinc-500">{item.sku}</td>
                        <td className="px-6 py-4 font-medium text-gray-800">{item.nombre}</td>
                        <td className="px-6 py-4">{item.categoria}</td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              item.stock <= 3
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {item.stock} u.
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-800">
                          ${item.precioVenta.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal Ficha Técnica */}
      <NuevaOrdenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGuardar={handleGuardarOrden}
      />
    </div>
  );
}