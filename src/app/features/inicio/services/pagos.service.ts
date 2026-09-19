import { Injectable, inject } from '@angular/core';
import { NEVER, Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { MockScenarioService } from '../../../core/config/mock-scenario.service';
import { MOCK_PAGOS, MOCK_PAGOS_LARGOS } from '../data/pagos.mock';
import { Pago } from '../models/pago.model';

const LATENCIA_SIMULADA_MS = 500;

@Injectable({ providedIn: 'root' })
export class PagosService {
  private readonly mockScenario = inject(MockScenarioService);

  obtenerPagos(): Observable<Pago[]> {
    const escenario = this.mockScenario.current();

    if (escenario === 'loading') {
      return NEVER;
    }

    if (escenario === 'error') {
      return of(null).pipe(
        delay(LATENCIA_SIMULADA_MS),
        switchMap(() => throwError(() => new Error('No se pudieron cargar los pagos.'))),
      );
    }

    const pagos =
      escenario === 'empty' ? [] : escenario === 'long-content' ? MOCK_PAGOS_LARGOS : MOCK_PAGOS;

    return of([...pagos]).pipe(delay(LATENCIA_SIMULADA_MS));
  }
}
