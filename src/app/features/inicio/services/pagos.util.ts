import { EstadoPago, Pago } from '../models/pago.model';
import { ResumenPagoItem, ResumenPagos } from '../models/resumen-pagos.model';

function resumirPorEstado(pagos: readonly Pago[], estado: EstadoPago): ResumenPagoItem {
  const filtrados = pagos.filter((pago) => pago.estado === estado);
  return {
    cantidad: filtrados.length,
    total: filtrados.reduce((total, pago) => total + pago.monto, 0),
  };
}

export function calcularResumenPagos(pagos: readonly Pago[]): ResumenPagos {
  return {
    pendientes: resumirPorEstado(pagos, 'pendiente'),
    pagadas: resumirPorEstado(pagos, 'pagada'),
    vencidas: resumirPorEstado(pagos, 'vencida'),
  };
}

export function ordenarPorVencimiento(pagos: readonly Pago[]): Pago[] {
  return [...pagos].sort((a, b) => a.fechaVencimiento.getTime() - b.fechaVencimiento.getTime());
}

const MS_POR_DIA = 1000 * 60 * 60 * 24;

/** Un pago pendiente es "urgente" si vence dentro de `umbralDias` (por defecto 3). */
export function esPagoUrgente(pago: Pago, umbralDias = 3, ahora: Date = new Date()): boolean {
  if (pago.estado !== 'pendiente') {
    return false;
  }

  const diasHastaVencimiento = Math.ceil(
    (pago.fechaVencimiento.getTime() - ahora.getTime()) / MS_POR_DIA,
  );
  return diasHastaVencimiento <= umbralDias;
}
