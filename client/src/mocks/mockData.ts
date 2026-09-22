// src/mocks/mockData.ts
export const INVENTARIO_INICIAL = [
  { id: 'PROD-001', sku: 'ACE-CAS-001', nombre: 'Aceite Castrol Go! 2T 1L', categoria: 'Motocicleta', stock: 12, precioVenta: 18.50 },
  { id: 'PROD-002', sku: 'ACE-MAX-001', nombre: 'Aceite Maxima K2 2T 1L', categoria: 'Motocicleta', stock: 4, precioVenta: 12.50 },
  { id: 'PROD-003', sku: 'ACE-MAX-002', nombre: 'Aceite Maxima Castor927 2T 1L', categoria: 'Motocicleta', stock: 5, precioVenta: 8.00 },
  { id: 'PROD-007', sku: 'CHA-MAX-001', nombre: 'Chain Guard Maxima 513ml', categoria: 'Motocicleta', stock: 3, precioVenta: 14.00 },
  { id: 'PROD-008', sku: 'AIR-MAX-002', nombre: 'Air Filter Cleaner Maxima 507ml', categoria: 'Motocicleta', stock: 2, precioVenta: 11.00 },
];

export const ORDENES_EJEMPLO = [
  {
    id: 'OT-2026-001',
    fechaIngreso: '2026-09-16',
    fechaEntrega: '2026-09-18',
    cliente: {
      nombre: 'Juan Pérez',
      documento: '1804567890',
      telefono: '0987654321',
      ciudad: 'Patate'
    },
    vehiculo: {
      tipo: 'Motocicleta',
      marca: 'Shineray',
      modelo: 'XY200',
      placa: 'HI-345Q',
      color: 'Rojo'
    },
    estado: 'En Proceso',
    total: 40.50,
    saldo: 15.50
  }
];