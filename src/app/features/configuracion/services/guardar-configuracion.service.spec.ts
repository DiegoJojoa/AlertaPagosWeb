import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, vi } from 'vitest';
import { MockScenarioService } from '../../../core/config/mock-scenario.service';
import { ActualizarConfiguracion } from '../models/actualizar-configuracion.model';
import { GuardarConfiguracionService } from './guardar-configuracion.service';

const DATOS: ActualizarConfiguracion = {
  idioma: 'es-CO',
  moneda: 'COP',
};

describe('GuardarConfiguracionService', () => {
  let service: GuardarConfiguracionService;
  let mockScenario: MockScenarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuardarConfiguracionService);
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
    const assertion = expect(resultado).rejects.toThrow('No se pudo guardar la configuración.');

    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
  });
});
