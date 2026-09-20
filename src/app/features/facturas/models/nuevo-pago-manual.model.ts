import { TipoServicio } from './tipo-servicio.model';

export interface NuevoPagoManual {
  readonly proveedor: string;
  readonly tipoServicio: TipoServicio;
  readonly monto: number;
  /** Fecha en formato ISO "yyyy-MM-dd", tal como la entrega un input type="date". */
  readonly fecha: string;
  readonly notas: string;
}
