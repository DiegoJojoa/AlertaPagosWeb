export type EstadoFactura = 'pendiente' | 'pagada' | 'vencida' | 'anulada';

export interface EventoHistorialFactura {
  readonly fecha: Date;
  readonly descripcion: string;
}

export interface Factura {
  readonly id: string;
  readonly numero: string;
  readonly servicio: string;
  readonly empresa: string;
  readonly monto: number;
  readonly fechaVencimiento: Date;
  readonly estado: EstadoFactura;
  readonly historial: readonly EventoHistorialFactura[];
}

export interface FacturaListado extends Factura {
  readonly esProxima: boolean;
}
