import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { MockScenarioService } from '../../../core/config/mock-scenario.service';

const LATENCIA_SIMULADA_MS = 900;

@Injectable({ providedIn: 'root' })
export class EliminarCuentaService {
  private readonly mockScenario = inject(MockScenarioService);

  eliminar(): Observable<void> {
    const escenario = this.mockScenario.current();

    if (escenario === 'error') {
      return of(null).pipe(
        delay(LATENCIA_SIMULADA_MS),
        switchMap(() =>
          throwError(() => new Error('No se pudo eliminar la cuenta. Intenta de nuevo.')),
        ),
      );
    }

    return of(undefined).pipe(delay(LATENCIA_SIMULADA_MS));
  }
}
