import { Routes } from '@angular/router';

export const FACTURAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/facturas-page/facturas-page').then((m) => m.FacturasPage),
  },
  {
    path: 'nueva',
    loadComponent: () =>
      import('./pages/agregar-pago-page/agregar-pago-page').then((m) => m.AgregarPagoPage),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/factura-detalle-page/factura-detalle-page').then((m) => m.FacturaDetallePage),
  },
];
