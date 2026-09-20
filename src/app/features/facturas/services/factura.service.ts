import { Injectable, inject } from '@angular/core';
import { NEVER, Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { MockScenarioService } from '../../../core/config/mock-scenario.service';
import { MOCK_FACTURA_CONTENIDO_EXTENSO, MOCK_FACTURAS } from '../data/facturas.mock';
import { Factura } from '../models/factura.model';

const LATENCIA_SIMULADA_MS = 500;

@Injectable({ providedIn: 'root' })
export class FacturaService {
  private readonly mockScenario = inject(MockScenarioService);

  /** Devuelve `null` cuando no existe ninguna factura con ese id (estado "vacío" del detalle). */
  obtenerFactura(id: string): Observable<Factura | null> {
    const escenario = this.mockScenario.current();

    if (escenario === 'loading') {
      return NEVER;
    }

    if (escenario === 'error') {
      return of(null).pipe(
        delay(LATENCIA_SIMULADA_MS),
        switchMap(() => throwError(() => new Error('No se pudo cargar la factura.'))),
      );
    }

    if (escenario === 'empty') {
      return of(null).pipe(delay(LATENCIA_SIMULADA_MS));
    }

    const factura =
      escenario === 'long-content'
        ? MOCK_FACTURA_CONTENIDO_EXTENSO
        : (MOCK_FACTURAS.find((f) => f.id === id) ?? null);

    return of(factura).pipe(delay(LATENCIA_SIMULADA_MS));
  }
}
