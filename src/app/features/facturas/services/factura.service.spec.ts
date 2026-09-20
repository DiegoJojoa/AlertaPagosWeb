import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, vi } from 'vitest';
import { MockScenarioService } from '../../../core/config/mock-scenario.service';
import { FacturaService } from './factura.service';

describe('FacturaService', () => {
  let service: FacturaService;
  let mockScenario: MockScenarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturaService);
    mockScenario = TestBed.inject(MockScenarioService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should resolve the matching factura for the default scenario', async () => {
    mockScenario.set('content');
    const resultado = firstValueFrom(service.obtenerFactura('pago-1'));

    await vi.advanceTimersByTimeAsync(1000);

    await expect(resultado).resolves.toMatchObject({ id: 'pago-1', numero: 'FAC-00123' });
  });

  it('should resolve null when no factura matches the given id ("empty" scenario)', async () => {
    mockScenario.set('empty');
    const resultado = firstValueFrom(service.obtenerFactura('id-inexistente'));

    await vi.advanceTimersByTimeAsync(1000);

    await expect(resultado).resolves.toBeNull();
  });

  it('should resolve null for a valid id when the "content" scenario has no match', async () => {
    mockScenario.set('content');
    const resultado = firstValueFrom(service.obtenerFactura('id-inexistente'));

    await vi.advanceTimersByTimeAsync(1000);

    await expect(resultado).resolves.toBeNull();
  });

  it('should resolve the extended-content factura for the "long-content" scenario', async () => {
    mockScenario.set('long-content');
    const resultado = firstValueFrom(service.obtenerFactura('pago-1'));

    await vi.advanceTimersByTimeAsync(1000);

    const factura = await resultado;
    expect(factura?.historial.length).toBeGreaterThan(5);
  });

  it('should error for the "error" scenario', async () => {
    mockScenario.set('error');
    const resultado = firstValueFrom(service.obtenerFactura('pago-1'));
    const assertion = expect(resultado).rejects.toThrow('No se pudo cargar la factura.');

    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
  });
});
