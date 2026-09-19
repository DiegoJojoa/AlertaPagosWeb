import { Pago } from '../models/pago.model';

function diasDesdeHoy(dias: number): Date {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  fecha.setHours(0, 0, 0, 0);
  return fecha;
}

/** Escenario "content": mezcla realista de pendientes, pagadas y vencidas. */
export const MOCK_PAGOS: readonly Pago[] = [
  {
    id: 'pago-1',
    proveedor: 'Energía',
    monto: 120000,
    fechaVencimiento: diasDesdeHoy(2),
    estado: 'pendiente',
  },
  {
    id: 'pago-2',
    proveedor: 'Internet',
    monto: 98000,
    fechaVencimiento: diasDesdeHoy(5),
    estado: 'pendiente',
  },
  {
    id: 'pago-3',
    proveedor: 'Agua',
    monto: 54000,
    fechaVencimiento: diasDesdeHoy(9),
    estado: 'pendiente',
  },
  {
    id: 'pago-4',
    proveedor: 'Gimnasio',
    monto: 76000,
    fechaVencimiento: diasDesdeHoy(11),
    estado: 'pendiente',
  },
  {
    id: 'pago-5',
    proveedor: 'Arriendo',
    monto: 650000,
    fechaVencimiento: diasDesdeHoy(-20),
    estado: 'pagada',
  },
  {
    id: 'pago-6',
    proveedor: 'Seguro del auto',
    monto: 180000,
    fechaVencimiento: diasDesdeHoy(-15),
    estado: 'pagada',
  },
  {
    id: 'pago-7',
    proveedor: 'Streaming',
    monto: 35000,
    fechaVencimiento: diasDesdeHoy(-10),
    estado: 'pagada',
  },
  {
    id: 'pago-8',
    proveedor: 'Gas natural',
    monto: 60000,
    fechaVencimiento: diasDesdeHoy(-8),
    estado: 'pagada',
  },
  {
    id: 'pago-9',
    proveedor: 'Colegiatura',
    monto: 300000,
    fechaVencimiento: diasDesdeHoy(-3),
    estado: 'pagada',
  },
  {
    id: 'pago-10',
    proveedor: 'Tarjeta de crédito',
    monto: 210000,
    fechaVencimiento: diasDesdeHoy(-4),
    estado: 'vencida',
  },
];

const PROVEEDORES_CONTENIDO_EXTENSO: readonly string[] = [
  'Energía',
  'Internet',
  'Agua',
  'Gimnasio',
  'Telefonía móvil',
  'Streaming',
  'Seguro de salud',
  'Arriendo',
  'Colegiatura',
  'Gas natural',
  'Tarjeta de crédito',
  'Administración',
  'Parqueadero',
  'Plan de datos',
  'Suscripción de software',
  'Mantenimiento del hogar',
  'Seguro del auto',
  'Club social',
];

/** Escenario "long-content": lista larga para validar scroll y overflow. */
export const MOCK_PAGOS_LARGOS: readonly Pago[] = PROVEEDORES_CONTENIDO_EXTENSO.map(
  (proveedor, index) => ({
    id: `pago-largo-${index + 1}`,
    proveedor,
    monto: 40000 + index * 15000,
    fechaVencimiento: diasDesdeHoy(index + 1),
    estado: 'pendiente',
  }),
);
