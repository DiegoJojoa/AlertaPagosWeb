import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, vi } from 'vitest';
import { MockScenarioService } from '../../../../core/config/mock-scenario.service';
import { FacturasPage } from './facturas-page';

describe('FacturasPage', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [FacturasPage],
      providers: [provideRouter([])],
    }).compileComponents();
    TestBed.inject(MockScenarioService).set('content');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function cargarPagina() {
    const fixture = TestBed.createComponent(FacturasPage);
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(600);
    fixture.detectChanges();
    return fixture;
  }

  it('muestra las tres facturas pendientes por defecto', async () => {
    const fixture = await cargarPagina();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('app-invoice-list-row').length).toBe(3);
    expect(compiled.textContent).toContain('Energía');
    expect(compiled.textContent).toContain('Internet');
    expect(compiled.textContent).toContain('Agua');
  });

  it('muestra solo Energía e Internet al seleccionar Próximos', async () => {
    const fixture = await cargarPagina();
    const compiled = fixture.nativeElement as HTMLElement;
    const proximos = Array.from(
      compiled.querySelectorAll<HTMLButtonElement>('.invoice-filter__option'),
    ).find((button) => button.textContent?.includes('Próximos'));

    proximos?.click();
    fixture.detectChanges();

    expect(compiled.querySelectorAll('app-invoice-list-row').length).toBe(2);
    expect(compiled.textContent).toContain('Energía');
    expect(compiled.textContent).toContain('Internet');
    expect(compiled.textContent).not.toContain('Agua');
  });

  it('enlaza cada fila con el detalle de la factura correspondiente', async () => {
    const fixture = await cargarPagina();
    const compiled = fixture.nativeElement as HTMLElement;
    const enlaces = Array.from(compiled.querySelectorAll<HTMLAnchorElement>('.invoice-row'));

    expect(enlaces.map((enlace) => enlace.getAttribute('href'))).toEqual([
      '/facturas/pago-1',
      '/facturas/pago-2',
      '/facturas/pago-3',
    ]);
  });
});
