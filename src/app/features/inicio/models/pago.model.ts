export type EstadoPago = 'pendiente' | 'pagada' | 'vencida';

export interface Pago {
  readonly id: string;
  readonly proveedor: string;
  readonly monto: number;
  readonly fechaVencimiento: Date;
  readonly estado: EstadoPago;
}
