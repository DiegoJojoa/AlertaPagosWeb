import { toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Subject, catchError, map, of, startWith, switchMap } from 'rxjs';
import {
  FiltroFacturas,
  InvoiceFilterTabs,
} from '../../components/invoice-filter-tabs/invoice-filter-tabs';
import { InvoiceListRow } from '../../components/invoice-list-row/invoice-list-row';
import { FacturaListado } from '../../models/factura.model';
import { FacturaService } from '../../services/factura.service';

type EstadoCarga =
  | { readonly tipo: 'cargando' }
  | { readonly tipo: 'error' }
  | { readonly tipo: 'contenido'; readonly facturas: readonly FacturaListado[] };

@Component({
  selector: 'app-facturas-page',
  imports: [InvoiceFilterTabs, InvoiceListRow],
  templateUrl: './facturas-page.html',
  styleUrl: './facturas-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturasPage {
  private readonly facturaService = inject(FacturaService);
  private readonly reintentar$ = new Subject<void>();

  protected readonly selectedFilter = signal<FiltroFacturas>('pendientes');
  protected readonly estado = toSignal(
    this.reintentar$.pipe(
      startWith(undefined),
      switchMap(() =>
        this.facturaService.obtenerFacturas().pipe(
          map((facturas): EstadoCarga => ({ tipo: 'contenido', facturas })),
          startWith<EstadoCarga>({ tipo: 'cargando' }),
          catchError(() => of<EstadoCarga>({ tipo: 'error' })),
        ),
      ),
    ),
    { initialValue: { tipo: 'cargando' } as EstadoCarga },
  );

  protected readonly facturasVisibles = computed(() => {
    const estado = this.estado();
    if (estado.tipo !== 'contenido') {
      return [];
    }

    const pendientes = estado.facturas.filter((factura) => factura.estado === 'pendiente');
    return this.selectedFilter() === 'proximas'
      ? pendientes.filter((factura) => factura.esProxima)
      : pendientes;
  });

  protected seleccionarFiltro(filtro: FiltroFacturas): void {
    this.selectedFilter.set(filtro);
  }

  protected reintentar(): void {
    this.reintentar$.next();
  }
}
