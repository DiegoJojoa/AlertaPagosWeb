import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, vi } from 'vitest';
import { MockScenarioService } from '../../../core/config/mock-scenario.service';
import { EliminarCuentaService } from './eliminar-cuenta.service';

describe('EliminarCuentaService', () => {
  let service: EliminarCuentaService;
  let mockScenario: MockScenarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EliminarCuentaService);
    mockScenario = TestBed.inject(MockScenarioService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should resolve after the simulated latency for the default scenario', async () => {
    mockScenario.set('content');
    const resultado = firstValueFrom(service.eliminar());

    await vi.advanceTimersByTimeAsync(1200);

    await expect(resultado).resolves.toBeUndefined();
  });

  it('should error for the "error" scenario', async () => {
    mockScenario.set('error');
    const resultado = firstValueFrom(service.eliminar());
    const assertion = expect(resultado).rejects.toThrow(
      'No se pudo eliminar la cuenta. Intenta de nuevo.',
    );

    await vi.advanceTimersByTimeAsync(1200);
    await assertion;
  });
});
