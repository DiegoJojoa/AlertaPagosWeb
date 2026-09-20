import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, vi } from 'vitest';
import { MockScenarioService } from '../../../core/config/mock-scenario.service';
import { NuevoPagoManual } from '../models/nuevo-pago-manual.model';
import { GuardarPagoManualService } from './guardar-pago-manual.service';

const DATOS: NuevoPagoManual = {
  proveedor: 'Energía de Bogotá',
  tipoServicio: 'Energía',
  monto: 120000,
  fecha: '2026-09-25',
  notas: '',
};

describe('GuardarPagoManualService', () => {
  let service: GuardarPagoManualService;
  let mockScenario: MockScenarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuardarPagoManualService);
    mockScenario = TestBed.inject(MockScenarioService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should resolve after the simulated latency for the default scenario', async () => {
    mockScenario.set('content');
    const resultado = firstValueFrom(service.guardar(DATOS));

    await vi.advanceTimersByTimeAsync(1000);

    await expect(resultado).resolves.toBeUndefined();
  });

  it('should error for the "error" scenario', async () => {
    mockScenario.set('error');
    const resultado = firstValueFrom(service.guardar(DATOS));
    const assertion = expect(resultado).rejects.toThrow('No se pudo guardar el pago.');

    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
  });
});
