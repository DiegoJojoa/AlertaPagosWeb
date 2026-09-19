import { toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { StatCard } from '../../components/stat-card/stat-card';
import { PaymentListItem } from '../../components/payment-list-item/payment-list-item';
import { Pago } from '../../models/pago.model';
import { PagosService } from '../../services/pagos.service';
import {
  calcularResumenPagos,
  esPagoUrgente,
  ordenarPorVencimiento,
} from '../../services/pagos.util';

type EstadoCarga =
  | { readonly tipo: 'cargando' }
  | { readonly tipo: 'error' }
  | { readonly tipo: 'contenido'; readonly pagos: readonly Pago[] };

interface PagoConUrgencia {
  readonly pago: Pago;
  readonly urgente: boolean;
}

@Component({
  selector: 'app-inicio-page',
  imports: [StatCard, PaymentListItem, RouterLink],
  templateUrl: './inicio-page.html',
  styleUrl: './inicio-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioPage {
  private readonly pagosService = inject(PagosService);
  private readonly reintentar$ = new Subject<void>();

  protected readonly estado = toSignal(
    this.reintentar$.pipe(
      startWith(undefined),
      switchMap(() =>
        this.pagosService.obtenerPagos().pipe(
          map((pagos): EstadoCarga => ({ tipo: 'contenido', pagos })),
          startWith<EstadoCarga>({ tipo: 'cargando' }),
          catchError(() => of<EstadoCarga>({ tipo: 'error' })),
        ),
      ),
    ),
    { initialValue: { tipo: 'cargando' } },
  );

  protected readonly resumen = computed(() => {
    const estado = this.estado();
    return estado.tipo === 'contenido' ? calcularResumenPagos(estado.pagos) : null;
  });

  protected readonly pagosPendientes = computed<readonly PagoConUrgencia[]>(() => {
    const estado = this.estado();
    if (estado.tipo !== 'contenido') {
      return [];
    }

    const pendientes = ordenarPorVencimiento(
      estado.pagos.filter((pago) => pago.estado === 'pendiente'),
    );
    return pendientes.map((pago) => ({ pago, urgente: esPagoUrgente(pago) }));
  });

  protected reintentar(): void {
    this.reintentar$.next();
  }
}
