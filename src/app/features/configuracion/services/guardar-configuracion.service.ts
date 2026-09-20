import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { MockScenarioService } from '../../../core/config/mock-scenario.service';
import { ActualizarConfiguracion } from '../models/actualizar-configuracion.model';

const LATENCIA_SIMULADA_MS = 600;

@Injectable({ providedIn: 'root' })
export class GuardarConfiguracionService {
  private readonly mockScenario = inject(MockScenarioService);

  guardar(datos: ActualizarConfiguracion): Observable<void> {
    const escenario = this.mockScenario.current();

    if (escenario === 'error') {
      return of(datos).pipe(
        delay(LATENCIA_SIMULADA_MS),
        switchMap(() => throwError(() => new Error('No se pudo guardar la configuración.'))),
      );
    }

    return of(undefined).pipe(delay(LATENCIA_SIMULADA_MS));
  }
}
