import { ResumenReporte } from '../models/reporte.model';

export const REPORTE_MES: ResumenReporte = {
  pagadas: { cantidad: 5, total: 420000 },
  pendientes: { cantidad: 3, total: 285000 },
  vencidas: { cantidad: 1, total: 54000 },
};

export const REPORTE_ANIO: ResumenReporte = {
  pagadas: { cantidad: 47, total: 4250000 },
  pendientes: { cantidad: 12, total: 1680000 },
  vencidas: { cantidad: 5, total: 720000 },
};

export const REPORTE_RANGO: ResumenReporte = {
  pagadas: { cantidad: 18, total: 1720000 },
  pendientes: { cantidad: 7, total: 890000 },
  vencidas: { cantidad: 2, total: 180000 },
};

export const REPORTE_VACIO: ResumenReporte = {
  pagadas: { cantidad: 0, total: 0 },
  pendientes: { cantidad: 0, total: 0 },
  vencidas: { cantidad: 0, total: 0 },
};
