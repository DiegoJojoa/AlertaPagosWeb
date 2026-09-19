import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, vi } from 'vitest';
import { MockScenarioService } from '../../../core/config/mock-scenario.service';
import { MOCK_PAGOS, MOCK_PAGOS_LARGOS } from '../data/pagos.mock';
import { PagosService } from './pagos.service';

describe('PagosService', () => {
  let service: PagosService;
  let mockScenario: MockScenarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagosService);
    mockScenario = TestBed.inject(MockScenarioService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should emit MOCK_PAGOS for the "content" scenario after the simulated latency', async () => {
    mockScenario.set('content');
    const resultado = firstValueFrom(service.obtenerPagos());

    await vi.advanceTimersByTimeAsync(600);

    expect(await resultado).toEqual(MOCK_PAGOS);
  });

  it('should emit the long dataset for the "long-content" scenario', async () => {
    mockScenario.set('long-content');
    const resultado = firstValueFrom(service.obtenerPagos());

    await vi.advanceTimersByTimeAsync(600);

    expect(await resultado).toEqual(MOCK_PAGOS_LARGOS);
  });

  it('should emit an empty array for the "empty" scenario', async () => {
    mockScenario.set('empty');
    const resultado = firstValueFrom(service.obtenerPagos());

    await vi.advanceTimersByTimeAsync(600);

    expect(await resultado).toEqual([]);
  });

  it('should error for the "error" scenario', async () => {
    mockScenario.set('error');
    const resultado = firstValueFrom(service.obtenerPagos());
    const assertion = expect(resultado).rejects.toThrow('No se pudieron cargar los pagos.');

    await vi.advanceTimersByTimeAsync(600);
    await assertion;
  });

  it('should never emit for the "loading" scenario', async () => {
    mockScenario.set('loading');
    const emitidos: unknown[] = [];
    service.obtenerPagos().subscribe((valor) => emitidos.push(valor));

    await vi.advanceTimersByTimeAsync(5000);

    expect(emitidos).toEqual([]);
  });
});
