import { useState } from 'react';
import { Search, Bike, Wrench, Calendar, History, Shield, MapPin, Phone, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PortalPublicoProps {
  onIrALogin: () => void;
}

export default function PortalPublico({ onIrALogin }: PortalPublicoProps) {
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
          cliente:clientes(nombre_completo, ciudad)
        `)
        .ilike('identificador', identificador.trim())
        .maybeSingle();

      if (errVeh) throw errVeh;
      setVehiculo(veh);

      // 2. Si el vehículo existe, traer sus órdenes
      if (veh) {
        const { data: ots, error: errOT } = await supabase
          .from('ordenes_trabajo')
          .select(`
            id,
            numero_orden,
            fecha_ingreso,
            tipo_servicio,
            estado,
            diagnostico_cliente,
            total,
            orden_detalles(id, cantidad, descripcion, subtotal)
          `)
          .eq('vehiculo_id', veh.id)
          .order('fecha_ingreso', { ascending: false });

        if (errOT) throw errOT;
        setOrdenesHistorial(ots || []);
      } else {
        setOrdenesHistorial([]);
      }
    } catch (err: any) {
      alert('Error en la consulta: ' + err.message);
    } finally {
      setBuscando(false);
    }
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col">
      {/* Barra de Navegación Pública */}
      <header className="border-b border-zinc-800/80 bg-zinc-900/50 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logoZona.jpg" alt="Logo" className="w-9 h-9 object-contain rounded-lg bg-zinc-800 p-0.5" />
            <div>
              <span className="font-black tracking-wider text-base block leading-none">ZONA RACING</span>
              <span className="text-[10px] text-zinc-400">Patate • Taller Especializado</span>
            </div>
          </div>
          <button
            onClick={onIrALogin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-red-500" />
            <span>Acceso Taller</span>
          </button>
        </div>
      </header>

      {/* Hero / Buscador Principal */}
      <div className="flex-1 max-w-5xl mx-auto px-4 py-8 md:py-12 w-full space-y-10">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-[11px] font-bold tracking-widest text-red-500 uppercase bg-red-950/60 border border-red-800/50 px-3 py-1 rounded-full">
            Consulta de Estado y Mantenimientos
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Hoja de Vida de tu Vehículo
          </h1>
          <p className="text-xs md:text-sm text-zinc-400">
            Ingresa el número de placa de tu motocicleta o la serie del cuadro de tu bicicleta para verificar el avance de tu orden o consultar tus mantenimientos anteriores.
          </p>

          {/* Formulario de Consulta */}
          <form onSubmit={handleBuscar} className="pt-3 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
              <input
                type="text"
                required
                placeholder="Ej: HI-345Q o Cuadro Bici..."
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs uppercase font-mono text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <button
              type="submit"
              disabled={buscando}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wide transition shadow-lg shadow-red-600/20 disabled:opacity-50 cursor-pointer"
            >
              {buscando ? 'Buscando...' : 'Consultar'}
            </button>
          </form>
        </div>

        {/* Resultados de la Búsqueda */}
        {busquedaRealizada && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            {vehiculo ? (
              <div className="space-y-6">
                {/* Ficha Vehículo */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-red-600/10 border border-red-600/20 text-red-500 rounded-xl">
                      {vehiculo.tipo_vehiculo === 'Motocicleta' ? (
                        <Wrench className="w-6 h-6" />
                      ) : (
                        <Bike className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-white">
                          {vehiculo.marca} {vehiculo.modelo}
                        </h3>
                        <span className="text-xs font-mono font-bold bg-zinc-800 text-zinc-200 px-2 py-0.5 rounded border border-zinc-700">
                          {vehiculo.identificador}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Color: {vehiculo.color} • Propietario: <strong className="text-zinc-200">{vehiculo.cliente?.nombre_completo}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right text-xs text-zinc-400">
                    <span className="block text-[10px] uppercase font-bold text-zinc-500">Historial Registrado</span>
                    <span className="text-sm font-black text-white">{ordenesHistorial.length} servicios</span>
                  </div>
                </div>

                {/* Timeline de Órdenes */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <History className="w-4 h-4 text-red-500" />
                    Historial de Reparaciones
                  </h4>

                  {ordenesHistorial.length === 0 ? (
                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl text-center text-xs text-zinc-500">
                      No hay registros ni órdenes abiertas para este vehículo.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {ordenesHistorial.map((ot) => (
                        <div
                          key={ot.id}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-md hover:border-zinc-700 transition"
                        >
                          <div className="flex flex-wrap justify-between items-center gap-2 border-b border-zinc-800 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                                {ot.numero_orden}
                              </span>
                              <span className="text-xs text-zinc-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {ot.fecha_ingreso}
                              </span>
                              <span className="text-xs text-zinc-300 font-medium">
                                • {ot.tipo_servicio}
                              </span>
                            </div>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${getBadgeColor(ot.estado)}`}>
                              {ot.estado}
                            </span>
                          </div>

                          {ot.diagnostico_cliente && (
                            <div className="text-xs text-zinc-400 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/60">
                              <strong className="text-zinc-300">Diagnóstico / Trabajo solicitado:</strong> {ot.diagnostico_cliente}
                            </div>
                          )}

                          {/* Repuestos / Tareas aplicadas */}
                          {ot.orden_detalles && ot.orden_detalles.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-zinc-500 uppercase block">Detalles del Servicio:</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                                {ot.orden_detalles.map((det: any) => (
                                  <div key={det.id} className="bg-zinc-800/60 px-2.5 py-1 rounded text-zinc-300 flex justify-between">
                                    <span>{det.cantidad}x {det.descripcion}</span>
                                    <span className="font-mono text-zinc-400">${Number(det.subtotal).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end items-center pt-2 border-t border-zinc-800/80 text-xs">
                            <span className="text-zinc-400 mr-2">Costo Total:</span>
                            <span className="font-black text-red-500 text-sm font-mono">${Number(ot.total || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 text-xs max-w-md mx-auto">
                No se encontró ningún vehículo registrado con la placa o serie <strong className="text-zinc-300 font-mono">"{identificador}"</strong>.
              </div>
            )}
          </div>
        )}

        {/* Información del Taller */}
        <div className="pt-8 border-t border-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/50">
            <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-zinc-200">Ubicación</p>
              <p>Patate, Tungurahua • Ecuador</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/50">
            <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-zinc-200">Atención Directa</p>
              <p>Mecánica y Repuestos Multimarca</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/50">
            <Shield className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-zinc-200">Garantía de Servicio</p>
              <p>Técnicos calificados en motos y bicis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}