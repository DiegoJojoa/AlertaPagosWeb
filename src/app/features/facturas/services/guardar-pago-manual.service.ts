import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { MockScenarioService } from '../../../core/config/mock-scenario.service';
import { NuevoPagoManual } from '../models/nuevo-pago-manual.model';

const LATENCIA_SIMULADA_MS = 700;

@Injectable({ providedIn: 'root' })
export class GuardarPagoManualService {
  private readonly mockScenario = inject(MockScenarioService);

  guardar(datos: NuevoPagoManual): Observable<void> {
    const escenario = this.mockScenario.current();

    if (escenario === 'error') {
      return of(datos).pipe(
        delay(LATENCIA_SIMULADA_MS),
        switchMap(() => throwError(() => new Error('No se pudo guardar el pago.'))),
      );
    }

    return of(undefined).pipe(delay(LATENCIA_SIMULADA_MS));
  }
}
