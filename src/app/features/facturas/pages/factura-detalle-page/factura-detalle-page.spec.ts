import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { afterEach, beforeEach, vi } from 'vitest';
import { MockScenario } from '../../../../core/config/mock-scenario.model';
import { MockScenarioService } from '../../../../core/config/mock-scenario.service';
import { ToastService } from '../../../../core/services/toast.service';
import { FacturaDetallePage } from './factura-detalle-page';

function crearFixture(
  id: string | null,
  escenario: MockScenario = 'content',
): ComponentFixture<FacturaDetallePage> {
  TestBed.configureTestingModule({
    imports: [FacturaDetallePage],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: { paramMap: of(convertToParamMap(id ? { id } : {})) },
      },
    ],
  });
  TestBed.inject(MockScenarioService).set(escenario);
  const fixture = TestBed.createComponent(FacturaDetallePage);
  fixture.detectChanges();
  return fixture;
}

async function cargarContenido(
  id = 'pago-1',
  escenario: MockScenario = 'content',
): Promise<ComponentFixture<FacturaDetallePage>> {
  const fixture = crearFixture(id, escenario);
  await vi.advanceTimersByTimeAsync(600);
  fixture.detectChanges();
  return fixture;
}

function encontrarBoton(compiled: HTMLElement, selector: string, texto: string): HTMLButtonElement {
  const boton = Array.from(compiled.querySelectorAll<HTMLButtonElement>(selector)).find((b) =>
    b.textContent?.includes(texto),
  );
  if (!boton) {
    throw new Error(`No se encontró un botón "${selector}" con texto "${texto}"`);
  }
  return boton;
}

describe('FacturaDetallePage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should show a loading state before the factura resolves', () => {
    const fixture = crearFixture('pago-1');
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.page__loading')?.textContent).toContain('Cargando factura');
  });

  it('should render the factura details once loaded', async () => {
    const fixture = await cargarContenido('pago-1');
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.factura-header__numero')?.textContent).toBe('FAC-00123');
    expect(compiled.textContent).toContain('ElectroBog - Energía');
    expect(compiled.textContent).toContain('$120.000');
    expect(compiled.querySelector('.factura-badge')?.textContent?.trim()).toBe('Pendiente');
  });

  it('should show a fallback message when the historial is empty', async () => {
    const fixture = await cargarContenido('pago-3');
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.factura-row__value--muted')?.textContent).toBe('Sin historial');
  });

  it('should show a "not found" state when no factura matches the id', async () => {
    const fixture = await cargarContenido('id-inexistente', 'empty');
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.page__empty-title')?.textContent).toBe(
      'No encontramos esta factura',
    );
  });

  it('should show an error state with a retry action, and recover on retry', async () => {
    const fixture = await cargarContenido('pago-1', 'error');
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.page__error-message')).not.toBeNull();

    TestBed.inject(MockScenarioService).set('content');
    compiled.querySelector<HTMLButtonElement>('.page__error .btn-outlined')?.click();
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(600);
    fixture.detectChanges();

    expect(compiled.querySelector('.factura-header__numero')?.textContent).toBe('FAC-00123');
  });

  it('should hide the "Marcar como pagada" and "Posponer" options for an already-paid factura', async () => {
    const fixture = await cargarContenido('pago-5');
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('.factura-action').length).toBe(0);
    expect(compiled.querySelector('.factura-options-note')?.textContent).toContain('ya fue pagada');
  });

  it('should show the pay confirm dialog and mark the factura as paid on confirm', async () => {
    const fixture = await cargarContenido('pago-1');
    const toastService = TestBed.inject(ToastService);
    const successSpy = vi.spyOn(toastService, 'success');
    const compiled = fixture.nativeElement as HTMLElement;

    encontrarBoton(compiled, '.factura-action', 'Marcar como pagada').click();
    fixture.detectChanges();

    expect(compiled.querySelector('.confirm-dialog__description')?.textContent).toContain(
      'Vas a pagar $120.000 por tu factura de Energía a ElectroBog.',
    );

    compiled.querySelector<HTMLButtonElement>('.confirm-dialog .btn-primary')?.click();
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(1000);
    fixture.detectChanges();

    expect(successSpy).toHaveBeenCalledWith('Factura marcada como pagada correctamente');
    expect(compiled.querySelector('app-confirm-dialog')).toBeNull();
    expect(compiled.querySelector('.factura-badge')?.textContent?.trim()).toBe('Pagada');
    expect(compiled.querySelectorAll('.factura-action').length).toBe(0);
  });

  it('should keep the pay dialog open with an inline error when it fails', async () => {
    const fixture = await cargarContenido('pago-1');
    const compiled = fixture.nativeElement as HTMLElement;

    encontrarBoton(compiled, '.factura-action', 'Marcar como pagada').click();
    fixture.detectChanges();

    TestBed.inject(MockScenarioService).set('error');
    compiled.querySelector<HTMLButtonElement>('.confirm-dialog .btn-primary')?.click();
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(1000);
    fixture.detectChanges();

    expect(compiled.querySelector('app-confirm-dialog')).not.toBeNull();
    expect(compiled.querySelector('.confirm-dialog__error')?.textContent).toContain(
      'No se pudo registrar el pago',
    );
  });

  it('should postpone the reminder with the default option and show a warning toast', async () => {
    const fixture = await cargarContenido('pago-1');
    const toastService = TestBed.inject(ToastService);
    const warningSpy = vi.spyOn(toastService, 'warning');
    const compiled = fixture.nativeElement as HTMLElement;

    encontrarBoton(compiled, '.factura-action', 'Posponer').click();
    fixture.detectChanges();

    compiled.querySelector<HTMLButtonElement>('app-posponer-dialog .btn-primary')?.click();
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(1000);
    fixture.detectChanges();

    expect(warningSpy).toHaveBeenCalledWith('Recordatorio pospuesto correctamente');
    expect(compiled.querySelector('app-posponer-dialog')).toBeNull();
    expect(compiled.textContent).toContain('Recordatorio pospuesto: En 1 hora');
  });

  it('should annul the factura and show a danger toast', async () => {
    const fixture = await cargarContenido('pago-1');
    const toastService = TestBed.inject(ToastService);
    const dangerSpy = vi.spyOn(toastService, 'danger');
    const compiled = fixture.nativeElement as HTMLElement;

    encontrarBoton(compiled, '.factura-action', 'Anular factura').click();
    fixture.detectChanges();

    expect(compiled.querySelector('.confirm-dialog__description')?.textContent).toContain(
      'La factura FAC-00123 de Energía será anulada permanentemente.',
    );

    compiled.querySelector<HTMLButtonElement>('.confirm-dialog .btn-danger')?.click();
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(1000);
    fixture.detectChanges();

    expect(dangerSpy).toHaveBeenCalledWith('Factura anulada correctamente');
    expect(compiled.querySelector('.factura-badge')?.textContent?.trim()).toBe('Anulada');
    expect(compiled.querySelectorAll('.factura-action').length).toBe(0);
  });

  it('should close the confirm dialog without calling the service when cancelled', async () => {
    const fixture = await cargarContenido('pago-1');
    const compiled = fixture.nativeElement as HTMLElement;

    encontrarBoton(compiled, '.factura-action', 'Anular factura').click();
    fixture.detectChanges();

    compiled.querySelector<HTMLButtonElement>('.confirm-dialog .btn-outlined')?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('app-confirm-dialog')).toBeNull();
    expect(compiled.querySelector('.factura-badge')?.textContent?.trim()).toBe('Pendiente');
  });
});
