import { Factura } from '../models/factura.model';

function diasDesdeHoy(dias: number): Date {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  fecha.setHours(0, 0, 0, 0);
  return fecha;
}

/**
 * Escenario "content". Los id coinciden con los de `MOCK_PAGOS` en la
 * feature Inicio para que el enlace de cada pago lleve a un detalle real.
 */
export const MOCK_FACTURAS: readonly Factura[] = [
  {
    id: 'pago-1',
    numero: 'FAC-00123',
    servicio: 'Energía',
    empresa: 'ElectroBog',
    monto: 120000,
    fechaVencimiento: diasDesdeHoy(2),
    estado: 'pendiente',
    historial: [
      { fecha: diasDesdeHoy(-11), descripcion: 'Factura enviada' },
      { fecha: diasDesdeHoy(-2), descripcion: 'Recordatorio enviado' },
    ],
  },
  {
    id: 'pago-2',
    numero: 'FAC-00124',
    servicio: 'Internet',
    empresa: 'NetColombia',
    monto: 98000,
    fechaVencimiento: diasDesdeHoy(5),
    estado: 'pendiente',
    historial: [{ fecha: diasDesdeHoy(-9), descripcion: 'Factura enviada' }],
  },
  {
    id: 'pago-3',
    numero: 'FAC-00125',
    servicio: 'Agua',
    empresa: 'Aguas de Bogotá',
    monto: 54000,
    fechaVencimiento: diasDesdeHoy(9),
    estado: 'pendiente',
    // Factura recién registrada: todavía no tiene eventos de historial.
    historial: [],
  },
  {
    id: 'pago-4',
    numero: 'FAC-00126',
    servicio: 'Gimnasio',
    empresa: 'BodyFit',
    monto: 76000,
    fechaVencimiento: diasDesdeHoy(11),
    estado: 'pendiente',
    historial: [{ fecha: diasDesdeHoy(-4), descripcion: 'Factura enviada' }],
  },
  {
    id: 'pago-5',
    numero: 'FAC-00127',
    servicio: 'Arriendo',
    empresa: 'Inmobiliaria Rojas',
    monto: 650000,
    fechaVencimiento: diasDesdeHoy(-20),
    estado: 'pagada',
    historial: [
      { fecha: diasDesdeHoy(-30), descripcion: 'Factura enviada' },
      { fecha: diasDesdeHoy(-21), descripcion: 'Pago registrado' },
    ],
  },
  {
    id: 'pago-6',
    numero: 'FAC-00128',
    servicio: 'Seguro del auto',
    empresa: 'Seguros Andes',
    monto: 180000,
    fechaVencimiento: diasDesdeHoy(-15),
    estado: 'pagada',
    historial: [{ fecha: diasDesdeHoy(-16), descripcion: 'Pago registrado' }],
  },
  {
    id: 'pago-7',
    numero: 'FAC-00129',
    servicio: 'Streaming',
    empresa: 'StreamPlus',
    monto: 35000,
    fechaVencimiento: diasDesdeHoy(-10),
    estado: 'pagada',
    historial: [{ fecha: diasDesdeHoy(-11), descripcion: 'Pago registrado' }],
  },
  {
    id: 'pago-8',
    numero: 'FAC-00130',
    servicio: 'Gas natural',
    empresa: 'Gas Natural Fenosa',
    monto: 60000,
    fechaVencimiento: diasDesdeHoy(-8),
    estado: 'pagada',
    historial: [{ fecha: diasDesdeHoy(-9), descripcion: 'Pago registrado' }],
  },
  {
    id: 'pago-9',
    numero: 'FAC-00131',
    servicio: 'Colegiatura',
    empresa: 'Colegio San Marcos',
    monto: 300000,
    fechaVencimiento: diasDesdeHoy(-3),
    estado: 'pagada',
    historial: [{ fecha: diasDesdeHoy(-4), descripcion: 'Pago registrado' }],
  },
  {
    id: 'pago-10',
    numero: 'FAC-00132',
    servicio: 'Tarjeta de crédito',
    empresa: 'Banco Andino',
    monto: 210000,
    fechaVencimiento: diasDesdeHoy(-4),
    estado: 'vencida',
    historial: [
      { fecha: diasDesdeHoy(-18), descripcion: 'Factura enviada' },
      { fecha: diasDesdeHoy(-4), descripcion: 'Factura vencida' },
    ],
  },
];

/** Escenario "long-content": historial extenso y textos largos, para validar overflow. */
export const MOCK_FACTURA_CONTENIDO_EXTENSO: Factura = {
  id: 'pago-largo-1',
  numero: 'FAC-00456',
  servicio: 'Administración de conjunto residencial',
  empresa: 'Administradora Integral de Propiedad Horizontal S.A.S.',
  monto: 480000,
  fechaVencimiento: diasDesdeHoy(6),
  estado: 'pendiente',
  historial: [
    { fecha: diasDesdeHoy(-40), descripcion: 'Factura generada por el sistema' },
    { fecha: diasDesdeHoy(-38), descripcion: 'Factura enviada por correo electrónico' },
    { fecha: diasDesdeHoy(-30), descripcion: 'Primer recordatorio enviado' },
    { fecha: diasDesdeHoy(-25), descripcion: 'Recordatorio pospuesto: en 1 día' },
    { fecha: diasDesdeHoy(-20), descripcion: 'Segundo recordatorio enviado' },
    { fecha: diasDesdeHoy(-15), descripcion: 'Recordatorio pospuesto: en 1 hora' },
    { fecha: diasDesdeHoy(-10), descripcion: 'Tercer recordatorio enviado' },
    { fecha: diasDesdeHoy(-1), descripcion: 'Cuarto recordatorio enviado' },
  ],
};
