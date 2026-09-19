import { Routes } from '@angular/router';

export const FACTURAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/facturas-page/facturas-page').then((m) => m.FacturasPage),
  },
];
