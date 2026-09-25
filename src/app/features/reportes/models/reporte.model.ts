import { ResumenPagos } from '../../inicio/models/resumen-pagos.model';

export type ReportPeriodType = 'month' | 'year' | 'custom';

export interface ReporteAplicado {
  readonly tipo: ReportPeriodType;
  readonly mes: Date;
  readonly anio: number;
  readonly desde: string;
  readonly hasta: string;
}

export type ResumenReporte = ResumenPagos;
