import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';
import { MockScenarioService } from '../../../core/config/mock-scenario.service';
import { OpcionPosponer } from '../models/opcion-posponer.model';

const LATENCIA_SIMULADA_MS = 800;

/**
 * Acciones sobre una factura (marcar como pagada, posponer recordatorio, anular).
 * Solo simulan éxito/error tras un delay: la mutación del estado en memoria
 * la aplica la página que consume el servicio, igual que en Configuración.
 */
@Injectable({ providedIn: 'root' })
export class FacturaAccionesService {
  private readonly mockScenario = inject(MockScenarioService);

  marcarComoPagada(id: string): Observable<void> {
    return this.simular(id, 'No se pudo registrar el pago. Intenta de nuevo.');
  }

  posponerRecordatorio(id: string, opcion: OpcionPosponer): Observable<void> {
    return this.simular({ id, opcion }, 'No se pudo posponer el recordatorio. Intenta de nuevo.');
  }

  anularFactura(id: string): Observable<void> {
    return this.simular(id, 'No se pudo anular la factura. Intenta de nuevo.');
  }

  private simular(payload: unknown, mensajeError: string): Observable<void> {
    const escenario = this.mockScenario.current();

    if (escenario === 'error') {
      return of(payload).pipe(
        delay(LATENCIA_SIMULADA_MS),
        switchMap(() => throwError(() => new Error(mensajeError))),
      );
    }

    return of(payload).pipe(
      delay(LATENCIA_SIMULADA_MS),
      map(() => undefined),
    );
  }
}
