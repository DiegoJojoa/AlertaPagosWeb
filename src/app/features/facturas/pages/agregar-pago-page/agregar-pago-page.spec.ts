import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { afterEach, vi } from 'vitest';
import { MockScenarioService } from '../../../../core/config/mock-scenario.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AgregarPagoPage } from './agregar-pago-page';

function crearFixture(): ComponentFixture<AgregarPagoPage> {
  TestBed.configureTestingModule({
    imports: [AgregarPagoPage],
    providers: [provideRouter([])],
  });
  const fixture = TestBed.createComponent(AgregarPagoPage);
  fixture.detectChanges();
  return fixture;
}

function establecerValor(elemento: HTMLInputElement | HTMLTextAreaElement, valor: string): void {
  elemento.value = valor;
  elemento.dispatchEvent(new Event('input'));
}

function llenarFormularioValido(fixture: ComponentFixture<AgregarPagoPage>): void {
  const compiled = fixture.nativeElement as HTMLElement;

  establecerValor(compiled.querySelector('#proveedor')!, 'Energía de Bogotá');

  const tipoServicio = compiled.querySelector<HTMLSelectElement>('#tipoServicio')!;
  tipoServicio.selectedIndex = 1;
  tipoServicio.dispatchEvent(new Event('change'));

  establecerValor(compiled.querySelector('#monto')!, '120000');
  establecerValor(compiled.querySelector('#fecha')!, '2026-09-25');

  fixture.detectChanges();
}

function enviarFormulario(fixture: ComponentFixture<AgregarPagoPage>): void {
  const form = (fixture.nativeElement as HTMLElement).querySelector('form');
  form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  fixture.detectChanges();
}

describe('AgregarPagoPage', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should link "Cancelar" to Inicio', () => {
    const fixture = crearFixture();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.btn-outlined')?.getAttribute('href')).toBe('/inicio');
  });

  it('should keep "Guardar" disabled while the form is incomplete', () => {
    const fixture = crearFixture();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector<HTMLButtonElement>('.btn-primary')?.disabled).toBe(true);
  });

  it('should enable "Guardar" once every required field is filled', () => {
    const fixture = crearFixture();
    llenarFormularioValido(fixture);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector<HTMLButtonElement>('.btn-primary')?.disabled).toBe(false);
  });

  it('should show a validation message when a required field is touched and left empty', () => {
    const fixture = crearFixture();
    const compiled = fixture.nativeElement as HTMLElement;
    const proveedor = compiled.querySelector<HTMLInputElement>('#proveedor')!;

    proveedor.dispatchEvent(new Event('focus'));
    proveedor.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(compiled.querySelector('#proveedor-error')?.textContent).toBe(
      'El proveedor es obligatorio.',
    );
  });

  it('should not show a validation message before the field is touched', () => {
    const fixture = crearFixture();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#proveedor-error')).toBeNull();
  });

  it('should show "Guardando pago…", then a success toast and navigate to /inicio', async () => {
    vi.useFakeTimers();
    const fixture = crearFixture();
    llenarFormularioValido(fixture);

    const toastService = TestBed.inject(ToastService);
    const successSpy = vi.spyOn(toastService, 'success');
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    enviarFormulario(fixture);

    const compiled = fixture.nativeElement as HTMLElement;
    const boton = compiled.querySelector<HTMLButtonElement>('.btn-primary');
    expect(boton?.textContent?.trim()).toBe('Guardando pago…');
    expect(boton?.disabled).toBe(true);

    await vi.advanceTimersByTimeAsync(1000);
    fixture.detectChanges();

    expect(successSpy).toHaveBeenCalledWith('Pago manual guardado correctamente');
    expect(navigateSpy).toHaveBeenCalledWith('/inicio');
  });

  it('should show an inline error and stay on the page when the save fails', async () => {
    vi.useFakeTimers();
    const fixture = crearFixture();
    llenarFormularioValido(fixture);

    TestBed.inject(MockScenarioService).set('error');
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');

    enviarFormulario(fixture);
    await vi.advanceTimersByTimeAsync(1000);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.form__save-error')?.textContent).toContain(
      'No se pudo guardar el pago',
    );
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(compiled.querySelector<HTMLButtonElement>('.btn-primary')?.disabled).toBe(false);
  });
});
