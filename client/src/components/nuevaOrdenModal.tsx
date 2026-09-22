import React, { useState } from 'react';
import { X, Plus, Trash2, Bike, Wrench } from 'lucide-react';
import { INVENTARIO_INICIAL } from '../mocks/mockData';

interface ItemTrabajo {
  id: string;
  tipo: 'Servicio' | 'Repuesto';
  descripcion: string;
  cantidad: number;
  valorUnitario: number;
  tecnico: string;
}

interface NuevaOrdenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (nuevaOrden: any) => void;
}

export default function NuevaOrdenModal({ isOpen, onClose, onGuardar }: NuevaOrdenModalProps) {
  // Datos generales
  const [numeroOrden, setNumeroOrden] = useState(`OT-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [fechaIngreso, setFechaIngreso] = useState(new Date().toISOString().split('T')[0]);
  const [fechaEntrega, setFechaEntrega] = useState('');

  // Datos del Cliente
  const [cliente, setCliente] = useState({
    nombre: '',
    documento: '',
    telefono: '',
    correo: '',
    ciudad: 'Patate',
    direccion: '',
    contactoEmergencia: '',
    observaciones: '',
  });

  // Datos del Vehículo
  const [vehiculo, setVehiculo] = useState({
    tipo: 'Motocicleta' as 'Motocicleta' | 'Bicicleta',
    marca: '',
    modelo: '',
    anio: 2024,
    color: '',
    placaSerie: '',
    kilometraje: '',
    tipoServicio: 'Mantenimiento',
  });

  // Diagnóstico
  const [diagnostico, setDiagnostico] = useState('');

  // Trabajos y Repuestos
  const [items, setItems] = useState<ItemTrabajo[]>([
    {
      id: '1',
      tipo: 'Servicio',
      descripcion: 'Mantenimiento General y Diagnóstico',
      cantidad: 1,
      valorUnitario: 15.0,
      tecnico: 'Técnico Principal',
    },
  ]);

  // Valores de Costos
  const [abono, setAbono] = useState<number>(0);
  const [otrosCostos, setOtrosCostos] = useState<number>(0);

  if (!isOpen) return null;

  // Cálculos dinámicos
  const costoServicios = items
    .filter((i) => i.tipo === 'Servicio')
    .reduce((acc, curr) => acc + curr.cantidad * curr.valorUnitario, 0);

  const costoRepuestos = items
    .filter((i) => i.tipo === 'Repuesto')
    .reduce((acc, curr) => acc + curr.cantidad * curr.valorUnitario, 0);

  const subtotal = costoServicios + costoRepuestos + Number(otrosCostos || 0);
  const saldoPendiente = subtotal - Number(abono || 0);

  // Handlers para la tabla de repuestos/trabajos
  const handleAddItem = (tipo: 'Servicio' | 'Repuesto') => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        tipo,
        descripcion: tipo === 'Repuesto' ? INVENTARIO_INICIAL[0].nombre : '',
        cantidad: 1,
        valorUnitario: tipo === 'Repuesto' ? INVENTARIO_INICIAL[0].precioVenta : 0,
        tecnico: 'Técnico Principal',
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof ItemTrabajo, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;
        
        // Si cambia el repuesto seleccionado del select, actualizar el precio unitario
        if (field === 'descripcion' && item.tipo === 'Repuesto') {
          const prod = INVENTARIO_INICIAL.find((p) => p.nombre === value);
          return {
            ...item,
            descripcion: value,
            valorUnitario: prod ? prod.precioVenta : item.valorUnitario,
          };
        }

        return { ...item, [field]: value };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ordenFinal = {
      id: numeroOrden,
      fechaIngreso,
      fechaEntrega,
      cliente,
      vehiculo,
      diagnostico,
      items,
      resumenCostos: {
        manoObra: costoServicios,
        repuestos: costoRepuestos,
        otros: otrosCostos,
        total: subtotal,
        abono,
        saldo: saldoPendiente,
      },
      estado: 'Pendiente',
    };
    onGuardar(ordenFinal);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Cabecera del Modal */}
        <div className="bg-zinc-900 text-white p-5 flex justify-between items-center border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <span className="bg-red-600 text-white font-black px-2.5 py-1 rounded text-sm">
              {numeroOrden}
            </span>
            <h2 className="text-xl font-black tracking-wide">ORDEN DE TRABAJO Y RECEPCIÓN</h2>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulario Scrolleable */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fecha Ingreso</label>
              <input
                type="date"
                value={fechaIngreso}
                onChange={(e) => setFechaIngreso(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fecha Entrega Estimada</label>
              <input
                type="date"
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* 1. Datos del Cliente */}
          <div className="border border-gray-200 rounded-xl p-5 bg-white">
            <h3 className="text-sm font-black uppercase text-red-600 border-b border-gray-100 pb-2 mb-4">
              1. Datos del Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre / Razón Social *</label>
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={cliente.nombre}
                  onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Cédula / RUC *</label>
                <input
                  type="text"
                  placeholder="180..."
                  value={cliente.documento}
                  onChange={(e) => setCliente({ ...cliente, documento: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="text"
                  placeholder="098..."
                  value={cliente.telefono}
                  onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Ciudad</label>
                <input
                  type="text"
                  value={cliente.ciudad}
                  onChange={(e) => setCliente({ ...cliente, ciudad: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Dirección</label>
                <input
                  type="text"
                  placeholder="Av. Principal y ..."
                  value={cliente.direccion}
                  onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Contacto de Emergencia</label>
                <input
                  type="text"
                  placeholder="Nombre y Teléfono"
                  value={cliente.contactoEmergencia}
                  onChange={(e) => setCliente({ ...cliente, contactoEmergencia: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Datos del Vehículo */}
          <div className="border border-gray-200 rounded-xl p-5 bg-white">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-4">
              <h3 className="text-sm font-black uppercase text-red-600">2. Datos del Vehículo</h3>
              {/* Selector Motocicleta / Bicicleta */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVehiculo({ ...vehiculo, tipo: 'Motocicleta' })}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                    vehiculo.tipo === 'Motocicleta' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" /> Motocicleta
                </button>
                <button
                  type="button"
                  onClick={() => setVehiculo({ ...vehiculo, tipo: 'Bicicleta' })}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                    vehiculo.tipo === 'Bicicleta' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" /> Bicicleta
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Marca *</label>
                <input
                  type="text"
                  placeholder="Ej: Shineray / Trek"
                  value={vehiculo.marca}
                  onChange={(e) => setVehiculo({ ...vehiculo, marca: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Modelo *</label>
                <input
                  type="text"
                  placeholder="Ej: XY200 / Marlin 5"
                  value={vehiculo.modelo}
                  onChange={(e) => setVehiculo({ ...vehiculo, modelo: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Año</label>
                <input
                  type="number"
                  value={vehiculo.anio}
                  onChange={(e) => setVehiculo({ ...vehiculo, anio: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Color</label>
                <input
                  type="text"
                  placeholder="Ej: Rojo / Negro"
                  value={vehiculo.color}
                  onChange={(e) => setVehiculo({ ...vehiculo, color: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {vehiculo.tipo === 'Motocicleta' ? 'Placa *' : 'N° de Serie Cuadro *'}
                </label>
                <input
                  type="text"
                  placeholder={vehiculo.tipo === 'Motocicleta' ? 'HI-345Q' : 'WTU-88765'}
                  value={vehiculo.placaSerie}
                  onChange={(e) => setVehiculo({ ...vehiculo, placaSerie: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none uppercase"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Kilometraje / Horas</label>
                <input
                  type="text"
                  placeholder="Ej: 15,400 km"
                  value={vehiculo.kilometraje}
                  onChange={(e) => setVehiculo({ ...vehiculo, kilometraje: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo de Servicio</label>
                <select
                  value={vehiculo.tipoServicio}
                  onChange={(e) => setVehiculo({ ...vehiculo, tipoServicio: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none bg-white"
                >
                  <option value="Mantenimiento General">Mantenimiento General</option>
                  <option value="Reparación Correctiva">Reparación Correctiva</option>
                  <option value="Diagnóstico Eléctrico/Mecánico">Diagnóstico Eléctrico/Mecánico</option>
                  <option value="Revisión Rápida">Revisión Rápida</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Diagnóstico / Observaciones */}
          <div className="border border-gray-200 rounded-xl p-5 bg-white">
            <h3 className="text-sm font-black uppercase text-red-600 border-b border-gray-100 pb-2 mb-3">
              3. Diagnóstico / Trabajos Solicitados
            </h3>
            <textarea
              rows={2}
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
              placeholder="Describa los síntomas reportados por el cliente o trabajos específicos requeridos..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* 4. Trabajos Realizados y Repuestos Utilizados */}
          <div className="border border-gray-200 rounded-xl p-5 bg-white">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-4">
              <h3 className="text-sm font-black uppercase text-red-600">
                4. Trabajos Realizados y Repuestos
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAddItem('Servicio')}
                  className="flex items-center gap-1 text-xs bg-zinc-800 hover:bg-black text-white px-3 py-1.5 rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar Mano de Obra
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem('Repuesto')}
                  className="flex items-center gap-1 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar Repuesto
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="p-2.5">Tipo</th>
                    <th className="p-2.5">Descripción / Producto</th>
                    <th className="p-2.5 w-20 text-center">Cant.</th>
                    <th className="p-2.5 w-28 text-right">V. Unit ($)</th>
                    <th className="p-2.5 w-28 text-right">Subtotal ($)</th>
                    <th className="p-2.5 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-bold ${
                            item.tipo === 'Servicio' ? 'bg-zinc-100 text-zinc-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.tipo}
                        </span>
                      </td>
                      <td className="p-2">
                        {item.tipo === 'Repuesto' ? (
                          <select
                            value={item.descripcion}
                            onChange={(e) => handleItemChange(item.id, 'descripcion', e.target.value)}
                            className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white focus:outline-none"
                          >
                            {INVENTARIO_INICIAL.map((prod) => (
                              <option key={prod.id} value={prod.nombre}>
                                {prod.nombre} (Stock: {prod.stock}) - ${prod.precioVenta.toFixed(2)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={item.descripcion}
                            placeholder="Descripción del servicio..."
                            onChange={(e) => handleItemChange(item.id, 'descripcion', e.target.value)}
                            className="w-full border border-gray-300 rounded p-1.5 text-xs focus:outline-none"
                          />
                        )}
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) => handleItemChange(item.id, 'cantidad', Number(e.target.value))}
                          className="w-full border border-gray-300 rounded p-1.5 text-xs text-center focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          step="0.10"
                          value={item.valorUnitario}
                          onChange={(e) => handleItemChange(item.id, 'valorUnitario', Number(e.target.value))}
                          className="w-full border border-gray-300 rounded p-1.5 text-xs text-right focus:outline-none"
                        />
                      </td>
                      <td className="p-2 text-right font-bold text-gray-800">
                        ${(item.cantidad * item.valorUnitario).toFixed(2)}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Resumen de Costos y Saldo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end bg-gray-50 p-5 rounded-xl border border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Los repuestos seleccionados se descontarán del inventario automáticamente.</p>
              <p>• Toda orden guardada se listará en el panel con estado "Pendiente".</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Mano de obra:</span>
                <span className="font-semibold">${costoServicios.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Repuestos:</span>
                <span className="font-semibold">${costoRepuestos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Otros / Varios:</span>
                <input
                  type="number"
                  value={otrosCostos}
                  onChange={(e) => setOtrosCostos(Number(e.target.value))}
                  className="w-24 border border-gray-300 rounded p-1 text-right text-xs bg-white"
                />
              </div>
              <div className="flex justify-between text-base font-black border-t border-gray-200 pt-2 text-gray-900">
                <span>TOTAL:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Abono cliente:</span>
                <input
                  type="number"
                  value={abono}
                  onChange={(e) => setAbono(Number(e.target.value))}
                  className="w-24 border border-gray-300 rounded p-1 text-right text-xs bg-white font-semibold text-green-700"
                />
              </div>
              <div className="flex justify-between text-base font-black border-t border-gray-200 pt-2 text-red-600">
                <span>SALDO PENDIENTE:</span>
                <span>${saldoPendiente.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition"
            >
              Guardar Orden de Trabajo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}