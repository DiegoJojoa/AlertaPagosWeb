import { Injectable, signal } from '@angular/core';
import { MockScenario } from './mock-scenario.model';

/**
 * Punto central para elegir qué escenario mock devuelven los servicios de
 * las features (contenido normal, contenido extenso, carga, vacío o error).
 * Los servicios mock deben leer `current()` en vez de decidir por su cuenta.
 */
@Injectable({ providedIn: 'root' })
export class MockScenarioService {
  private readonly scenario = signal<MockScenario>('content');

  readonly current = this.scenario.asReadonly();

  set(scenario: MockScenario): void {
    this.scenario.set(scenario);
  }
}
