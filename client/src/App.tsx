import { useState, useEffect, useMemo } from 'react';
import { 
  ClipboardList, Package, Plus, Search, RefreshCw, Eye, History, 
  Bike, Wrench, AlertTriangle, LayoutGrid, Table, Layers, Zap, Disc, Fuel, Wind, Menu, X
} from 'lucide-react';
import { supabase } from './lib/supabase';
import NuevaOrdenModal from './components/nuevaOrdenModal';
import NuevoProductoModal from './components/NuevoProductoModal';
import DetalleOrdenModal from './components/DetalleOrdenModal';
import HistorialVehiculo from './components/HistorialVehiculo';

export default function App() {
  const [tab, setTab] = useState<'ordenes' | 'inventario' | 'historial'>('ordenes');
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [filtroSubcat, setFiltroSubcat] = useState<string>('TODAS');
  const [agruparPorSubcat, setAgruparPorSubcat] = useState<boolean>(true);
  const [vistaInventario, setVistaInventario] = useState<'tarjetas' | 'tabla'>('tarjetas');
  
  const [isNuevaOrdenOpen, setIsNuevaOrdenOpen] = useState(false);
  const [isNuevoProductoOpen, setIsNuevoProductoOpen] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<any | null>(null);

  const [cargando, setCargando] = useState(true);
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [inventario, setInventario] = useState<any[]>([]);

  const fetchOrdenes = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from('ordenes_trabajo')
      .select(`
        *,
        cliente:clientes(nombre_completo, telefono, ciudad),
        vehiculo:vehiculos(tipo_vehiculo, marca, modelo, color, identificador)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) setOrdenes(data);
    setCargando(false);
  };

  const fetchInventario = async () => {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('subcategoria', { ascending: true })
      .order('nombre', { ascending: true });

    if (!error && data) setInventario(data);
  };

  useEffect(() => {
    fetchOrdenes();
    fetchInventario();
  }, []);

  const handleRefrescarTodo = () => {
    fetchOrdenes();
    fetchInventario();
  };

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'En Proceso': return 'bg-blue-100 text-blue-800';
      case 'Terminado': return 'bg-emerald-100 text-emerald-800';
      case 'Entregado': return 'bg-zinc-100 text-zinc-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const listaSubcategorias = useMemo(() => {
    const setSub = new Set<string>();
    inventario.forEach((item) => {
      if (item.subcategoria) setSub.add(item.subcategoria);
    });
    return Array.from(setSub).sort();
  }, [inventario]);

  const inventarioFiltrado = useMemo(() => {
    return inventario.filter((item) => {
      const matchText =
        item.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.codigo_sku?.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.subcategoria?.toLowerCase().includes(busqueda.toLowerCase());

      if (!matchText) return false;

      if (filtroTipo === 'SERVICIOS' && item.tipo !== 'Servicio') return false;
      if (filtroTipo === 'CRITICO' && (item.tipo !== 'Producto' || item.stock_actual > item.stock_minimo)) return false;
      if (filtroTipo !== 'TODOS' && filtroTipo !== 'SERVICIOS' && filtroTipo !== 'CRITICO') {
        if (item.categoria_vehiculo !== filtroTipo) return false;
      }

      if (filtroSubcat !== 'TODAS' && item.subcategoria !== filtroSubcat) return false;

      return true;
    });
  }, [inventario, busqueda, filtroTipo, filtroSubcat]);

  const gruposInventario = useMemo(() => {
    const mapa: { [key: string]: any[] } = {};
    inventarioFiltrado.forEach((item) => {
      const key = item.subcategoria || 'Varios / General';
      if (!mapa[key]) mapa[key] = [];
      mapa[key].push(item);
    });
    return mapa;
  }, [inventarioFiltrado]);

  const totalItems = inventario.filter((i) => i.tipo === 'Producto').reduce((acc, curr) => acc + (curr.stock_actual || 0), 0);
  const totalBajoStock = inventario.filter((i) => i.tipo === 'Producto' && i.stock_actual <= i.stock_minimo).length;

  const getSubcatIcon = (subcat: string) => {
    switch (subcat) {
      case 'Sistema Eléctrico': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'Transmisión': return <Disc className="w-4 h-4 text-orange-500" />;
      case 'Motor': return <Wrench className="w-4 h-4 text-red-500" />;
      case 'Lubricantes':
      case 'Químicos': return <Fuel className="w-4 h-4 text-blue-500" />;
      case 'Admisión':
      case 'Combustible': return <Wind className="w-4 h-4 text-teal-500" />;
      default: return <Package className="w-4 h-4 text-zinc-500" />;
    }
  };

  const cambiarTab = (nuevaTab: 'ordenes' | 'inventario' | 'historial') => {
    setTab(nuevaTab);
    setMenuMovilAbierto(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row print:bg-white font-sans">
      {/* Barra Superior Móvil */}
      <header className="md:hidden bg-zinc-900 text-white p-4 flex justify-between items-center sticky top-0 z-30 print:hidden">
        <div className="flex items-center gap-2">
          <img src="/logoZona.jpg" alt="Logo" className="w-8 h-8 object-contain rounded bg-zinc-800 p-0.5" />
          <span className="font-black tracking-wider text-sm">ZONA RACING</span>
        </div>
        <button
          onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
          className="p-2 text-zinc-300 hover:text-white"
        >
          {menuMovilAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Backdrop para móvil */}
      {menuMovilAbierto && (
        <div 
          onClick={() => setMenuMovilAbierto(false)} 
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        />
      )}

      {/* Barra Lateral (Desktop fija, Móvil desplegable) */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-zinc-900 text-white flex flex-col print:hidden flex-shrink-0 transition-transform duration-200
        ${menuMovilAbierto ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 border-b border-zinc-800 hidden md:flex items-center gap-3">
          <img
            src="/logoZona.jpg"
            alt="Logo Zona Racing"
            className="w-10 h-10 object-contain rounded-lg bg-zinc-800 p-0.5"
          />
          <div>
            <h1 className="font-black text-lg tracking-wider leading-none">ZONA RACING</h1>
            <p className="text-[11px] text-zinc-400 mt-1">Patate • Ecuador</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => cambiarTab('ordenes')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition cursor-pointer ${
              tab === 'ordenes' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            Órdenes de Trabajo
          </button>
          <button
            onClick={() => cambiarTab('inventario')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition cursor-pointer ${
              tab === 'inventario' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <Package className="w-5 h-5" />
            Inventario / Catálogo
          </button>
          <button
            onClick={() => cambiarTab('historial')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition cursor-pointer ${
              tab === 'historial' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <History className="w-5 h-5" />
            Historial por Placa
          </button>
        </nav>
      </aside>

      {/* Contenedor Principal */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto print:p-0">
        {tab === 'ordenes' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Órdenes de Trabajo</h2>
                <p className="text-gray-500 text-xs md:text-sm">Control de recepciones y mantenimientos en taller</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRefrescarTodo}
                  className="p-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer bg-white"
                  title="Recargar datos"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsNuevaOrdenOpen(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm transition cursor-pointer text-sm"
                >
                  <Plus className="w-5 h-5" />
                  Nueva Orden
                </button>
              </div>
            </div>

            {cargando ? (
              <div className="text-center py-12 text-gray-500 text-sm">Cargando órdenes desde Supabase...</div>
            ) : ordenes.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-500 text-sm">
                No hay órdenes registradas. Haz clic en "Nueva Orden" para crear una.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ordenes.map((ot: any) => (
                  <div
                    key={ot.id}
                    onClick={() => setOrdenSeleccionada(ot)}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5 flex flex-col justify-between hover:border-red-400 hover:shadow-md transition cursor-pointer"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">
                          {ot.numero_orden}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getBadgeColor(ot.estado)}`}>
                          {ot.estado}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-800 text-base md:text-lg">{ot.cliente?.nombre_completo || 'Cliente'}</h3>
                      <p className="text-xs text-gray-500 mb-3">{ot.cliente?.telefono} • {ot.cliente?.ciudad}</p>

                      <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3 text-sm text-gray-700 mb-3">
                        {ot.vehiculo?.tipo_vehiculo === 'Motocicleta' ? (
                          <Wrench className="w-4 h-4 text-red-500 flex-shrink-0" />
                        ) : (
                          <Bike className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-medium text-xs text-gray-800">
                            {ot.vehiculo?.marca} {ot.vehiculo?.modelo} ({ot.vehiculo?.color})
                          </p>
                          <p className="text-xs text-gray-400">
                            Placa/Serie: {ot.vehiculo?.identificador}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-sm">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Saldo pendiente</span>
                        <span className="font-bold text-red-600">
                          ${Number(ot.saldo || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-zinc-600">
                        <Eye className="w-3.5 h-3.5" /> Gestionar
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'inventario' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Inventario y Catálogo ({inventarioFiltrado.length})</h2>
                <p className="text-gray-500 text-xs md:text-sm">Repuestos organizados por subcategoría</p>
              </div>
              <button
                onClick={() => setIsNuevoProductoOpen(true)}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-sm cursor-pointer"
              >
                <Plus className="w-5 h-5" /> Agregar Repuesto
              </button>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Productos</p>
                  <p className="text-xl font-black text-gray-900">{inventario.length}</p>
                </div>
                <Package className="w-6 h-6 text-zinc-400" />
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Unidades en Stock</p>
                  <p className="text-xl font-black text-emerald-600">{totalItems} u.</p>
                </div>
                <Wrench className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Stock Crítico</p>
                  <p className="text-xl font-black text-red-600">{totalBajoStock} ítems</p>
                </div>
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            </div>

            {/* Controles y Búsqueda */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'TODOS', label: 'Todos' },
                    { id: 'Motocicleta', label: 'Motos' },
                    { id: 'Bicicleta', label: 'Bicis' },
                    { id: 'SERVICIOS', label: 'Mano Obra' },
                    { id: 'CRITICO', label: '⚠️ Bajo' },
                  ].map((tipo) => (
                    <button
                      key={tipo.id}
                      onClick={() => {
                        setFiltroTipo(tipo.id);
                        setFiltroSubcat('TODAS');
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        filtroTipo === tipo.id ? 'bg-red-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tipo.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-56">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar SKU o nombre..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-gray-50 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => setAgruparPorSubcat(!agruparPorSubcat)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      agruparPorSubcat ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-700 border-gray-300'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                    <button
                      onClick={() => setVistaInventario('tarjetas')}
                      className={`p-1.5 ${vistaInventario === 'tarjetas' ? 'bg-white text-red-600' : 'text-gray-400'}`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setVistaInventario('tabla')}
                      className={`p-1.5 ${vistaInventario === 'tabla' ? 'bg-white text-red-600' : 'text-gray-400'}`}
                    >
                      <Table className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Píldoras de Subcategorías */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100 text-xs">
                <button
                  onClick={() => setFiltroSubcat('TODAS')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    filtroSubcat === 'TODAS' ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  Todas ({inventario.length})
                </button>
                {listaSubcategorias.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setFiltroSubcat(sub)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
                      filtroSubcat === sub ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {getSubcatIcon(sub)}
                    <span>{sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Listado / Agrupado */}
            {agruparPorSubcat ? (
              <div className="space-y-6">
                {Object.keys(gruposInventario).map((subcatName) => (
                  <div key={subcatName} className="space-y-2">
                    <div className="flex items-center gap-2 border-b border-zinc-200 pb-1.5">
                      {getSubcatIcon(subcatName)}
                      <h3 className="text-sm font-black text-zinc-900 uppercase">{subcatName}</h3>
                      <span className="text-[10px] bg-zinc-200 text-zinc-800 font-bold px-1.5 py-0.2 rounded-full">
                        {gruposInventario[subcatName].length}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {gruposInventario[subcatName].map((prod) => (
                        <div key={prod.id} className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-sm flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-1.5">
                              <span className="font-mono text-[10px] font-bold text-zinc-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                {prod.codigo_sku}
                              </span>
                              <span className="text-[10px] text-gray-500">{prod.categoria_vehiculo}</span>
                            </div>
                            <h4 className="font-bold text-gray-800 text-xs mb-1">{prod.nombre}</h4>
                          </div>

                          <div className="border-t border-gray-100 pt-2 flex justify-between items-end mt-2">
                            <div>
                              <span className="text-[9px] text-gray-400 block">Stock</span>
                              {prod.tipo === 'Servicio' ? (
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Servicio</span>
                              ) : (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  prod.stock_actual <= prod.stock_minimo ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                }`}>
                                  {prod.stock_actual} u.
                                </span>
                              )}
                            </div>
                            <span className="text-base font-black text-gray-900">${Number(prod.precio_venta).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {inventarioFiltrado.map((prod) => (
                  <div key={prod.id} className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-mono text-[10px] font-bold text-zinc-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {prod.codigo_sku}
                        </span>
                        <span className="text-[10px] text-gray-500">{prod.subcategoria}</span>
                      </div>
                      <h4 className="font-bold text-gray-800 text-xs mb-1">{prod.nombre}</h4>
                    </div>

                    <div className="border-t border-gray-100 pt-2 flex justify-between items-end mt-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        prod.stock_actual <= prod.stock_minimo ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {prod.stock_actual} u.
                      </span>
                      <span className="text-base font-black text-gray-900">${Number(prod.precio_venta).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'historial' && <HistorialVehiculo />}
      </main>

      <NuevaOrdenModal
        isOpen={isNuevaOrdenOpen}
        onClose={() => setIsNuevaOrdenOpen(false)}
        onOrdenCreada={handleRefrescarTodo}
      />

      <NuevoProductoModal
        isOpen={isNuevoProductoOpen}
        onClose={() => setIsNuevoProductoOpen(false)}
        onProductoCreado={handleRefrescarTodo}
      />

      <DetalleOrdenModal
        orden={ordenSeleccionada}
        isOpen={!!ordenSeleccionada}
        onClose={() => setOrdenSeleccionada(null)}
        onOrdenActualizada={handleRefrescarTodo}
      />
    </div>
  );
}