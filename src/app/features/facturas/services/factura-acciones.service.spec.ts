import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, vi } from 'vitest';
import { MockScenarioService } from '../../../core/config/mock-scenario.service';
import { FacturaAccionesService } from './factura-acciones.service';

describe('FacturaAccionesService', () => {
  let service: FacturaAccionesService;
  let mockScenario: MockScenarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturaAccionesService);
    mockScenario = TestBed.inject(MockScenarioService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should resolve marcarComoPagada after the simulated latency', async () => {
    mockScenario.set('content');
    const resultado = firstValueFrom(service.marcarComoPagada('pago-1'));

    await vi.advanceTimersByTimeAsync(1000);

    await expect(resultado).resolves.toBeUndefined();
  });

  it('should resolve posponerRecordatorio after the simulated latency', async () => {
    mockScenario.set('content');
    const resultado = firstValueFrom(service.posponerRecordatorio('pago-1', '1-hora'));

    await vi.advanceTimersByTimeAsync(1000);

    await expect(resultado).resolves.toBeUndefined();
  });

  it('should error anularFactura for the "error" scenario', async () => {
    mockScenario.set('error');
    const resultado = firstValueFrom(service.anularFactura('pago-1'));
    const assertion = expect(resultado).rejects.toThrow(
      'No se pudo anular la factura. Intenta de nuevo.',
    );

    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
  });

  it('should error marcarComoPagada for the "error" scenario', async () => {
    mockScenario.set('error');
    const resultado = firstValueFrom(service.marcarComoPagada('pago-1'));
    const assertion = expect(resultado).rejects.toThrow(
      'No se pudo registrar el pago. Intenta de nuevo.',
    );

    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
  });
});
