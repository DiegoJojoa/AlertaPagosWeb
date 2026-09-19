export interface ResumenPagoItem {
  readonly cantidad: number;
  readonly total: number;
}

export interface ResumenPagos {
  readonly pendientes: ResumenPagoItem;
  readonly pagadas: ResumenPagoItem;
  readonly vencidas: ResumenPagoItem;
}
