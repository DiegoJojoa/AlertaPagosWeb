import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, vi } from 'vitest';
import { MockScenarioService } from '../../../../core/config/mock-scenario.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfiguracionPage } from './configuracion-page';

function crearFixture(): ComponentFixture<ConfiguracionPage> {
  TestBed.configureTestingModule({ imports: [ConfiguracionPage] });
  const fixture = TestBed.createComponent(ConfiguracionPage);
  fixture.detectChanges();
  return fixture;
}

function establecerValor(elemento: HTMLInputElement, valor: string): void {
  elemento.value = valor;
  elemento.dispatchEvent(new Event('input'));
}

describe('ConfiguracionPage', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should preselect a default idioma and moneda', () => {
    const fixture = crearFixture();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector<HTMLSelectElement>('#idioma')?.value).toBe('es-CO');
    expect(compiled.querySelector<HTMLSelectElement>('#moneda')?.value).toBe('COP');
  });

  it('should save immediately and toast when idioma changes, with no "Guardar" button involved', async () => {
    vi.useFakeTimers();
    const fixture = crearFixture();
    const toastService = TestBed.inject(ToastService);
    const successSpy = vi.spyOn(toastService, 'success');

    const compiled = fixture.nativeElement as HTMLElement;
    const idioma = compiled.querySelector<HTMLSelectElement>('#idioma')!;
    idioma.value = 'en-US';
    idioma.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    await vi.advanceTimersByTimeAsync(1000);
    fixture.detectChanges();

    expect(successSpy).toHaveBeenCalledWith('Idioma actualizado correctamente');
    expect(compiled.querySelector('.btn-primary')).toBeNull();
  });

  it('should revert idioma and toast an error when saving fails', async () => {
    vi.useFakeTimers();
    const fixture = crearFixture();
    TestBed.inject(MockScenarioService).set('error');
    const toastService = TestBed.inject(ToastService);
    const errorSpy = vi.spyOn(toastService, 'error');

    const compiled = fixture.nativeElement as HTMLElement;
    const idioma = compiled.querySelector<HTMLSelectElement>('#idioma')!;
    idioma.value = 'en-US';
    idioma.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    await vi.advanceTimersByTimeAsync(1000);
    fixture.detectChanges();

    expect(errorSpy).toHaveBeenCalledWith('No se pudo actualizar el idioma. Intenta de nuevo.');
    expect(compiled.querySelector<HTMLSelectElement>('#idioma')?.value).toBe('es-CO');
  });

  describe('cambiar contraseña', () => {
    it('should be collapsed by default and expand when the row is clicked', () => {
      const fixture = crearFixture();
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('#panel-cambiar-contrasena')).toBeNull();

      compiled.querySelector<HTMLButtonElement>('.account-row-group__trigger')?.click();
      fixture.detectChanges();

      expect(compiled.querySelector('#panel-cambiar-contrasena')).not.toBeNull();
    });

    it('should keep "Guardar" disabled until the password fields are valid', () => {
      const fixture = crearFixture();
      const compiled = fixture.nativeElement as HTMLElement;
      compiled.querySelector<HTMLButtonElement>('.account-row-group__trigger')?.click();
      fixture.detectChanges();

      expect(compiled.querySelector<HTMLButtonElement>('.btn-primary')?.disabled).toBe(true);

      establecerValor(compiled.querySelector('#actual')!, 'claveActual1');
      establecerValor(compiled.querySelector('#nueva')!, 'contrasenaNueva1');
      establecerValor(compiled.querySelector('#confirmar')!, 'contrasenaNueva1');
      fixture.detectChanges();

      expect(compiled.querySelector<HTMLButtonElement>('.btn-primary')?.disabled).toBe(false);
    });

    it('should collapse and clear the fields when "Cancelar" is clicked', () => {
      const fixture = crearFixture();
      const compiled = fixture.nativeElement as HTMLElement;
      compiled.querySelector<HTMLButtonElement>('.account-row-group__trigger')?.click();
      fixture.detectChanges();
      establecerValor(compiled.querySelector('#actual')!, 'claveActual1');

      compiled.querySelector<HTMLButtonElement>('.account-row-group__panel .btn-outlined')?.click();
      fixture.detectChanges();

      expect(compiled.querySelector('#panel-cambiar-contrasena')).toBeNull();
    });

    it('should save, collapse and toast on success', async () => {
      vi.useFakeTimers();
      const fixture = crearFixture();
      const toastService = TestBed.inject(ToastService);
      const successSpy = vi.spyOn(toastService, 'success');

      const compiled = fixture.nativeElement as HTMLElement;
      compiled.querySelector<HTMLButtonElement>('.account-row-group__trigger')?.click();
      fixture.detectChanges();
      establecerValor(compiled.querySelector('#actual')!, 'claveActual1');
      establecerValor(compiled.querySelector('#nueva')!, 'contrasenaNueva1');
      establecerValor(compiled.querySelector('#confirmar')!, 'contrasenaNueva1');
      fixture.detectChanges();

      compiled
        .querySelector('form')
        ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      fixture.detectChanges();

      await vi.advanceTimersByTimeAsync(1000);
      fixture.detectChanges();

      expect(successSpy).toHaveBeenCalledWith('Contraseña actualizada correctamente');
      expect(compiled.querySelector('#panel-cambiar-contrasena')).toBeNull();
    });
  });

  it('should show a toast when clicking "Cerrar sesión"', () => {
    const fixture = crearFixture();
    const toastService = TestBed.inject(ToastService);
    const successSpy = vi.spyOn(toastService, 'success');

    const compiled = fixture.nativeElement as HTMLElement;
    const botones = Array.from(compiled.querySelectorAll<HTMLButtonElement>('.account-row'));
    const cerrarSesionBtn = botones.find((b) => b.textContent?.trim() === 'Cerrar sesión');
    cerrarSesionBtn?.click();

    expect(successSpy).toHaveBeenCalledWith('Sesión cerrada correctamente');
  });

  describe('eliminar cuenta', () => {
    it('should open the confirm dialog when "Eliminar cuenta" is clicked', () => {
      const fixture = crearFixture();
      const compiled = fixture.nativeElement as HTMLElement;

      compiled.querySelector<HTMLButtonElement>('.account-row--danger')?.click();
      fixture.detectChanges();

      expect(compiled.querySelector('.confirm-dialog__title')?.textContent).toBe(
        '¿Eliminar tu cuenta?',
      );
    });

    it('should close the dialog without calling the service when cancelled', () => {
      const fixture = crearFixture();
      const compiled = fixture.nativeElement as HTMLElement;
      compiled.querySelector<HTMLButtonElement>('.account-row--danger')?.click();
      fixture.detectChanges();

      compiled.querySelector<HTMLButtonElement>('.confirm-dialog .btn-outlined')?.click();
      fixture.detectChanges();

      expect(compiled.querySelector('app-confirm-dialog')).toBeNull();
    });

    it('should show a loading label, then close the dialog and toast on confirm', async () => {
      vi.useFakeTimers();
      const fixture = crearFixture();
      const toastService = TestBed.inject(ToastService);
      const successSpy = vi.spyOn(toastService, 'success');

      const compiled = fixture.nativeElement as HTMLElement;
      compiled.querySelector<HTMLButtonElement>('.account-row--danger')?.click();
      fixture.detectChanges();
      compiled.querySelector<HTMLButtonElement>('.confirm-dialog .btn-danger')?.click();
      fixture.detectChanges();

      expect(compiled.querySelector('.confirm-dialog .btn-danger')?.textContent?.trim()).toBe(
        'Eliminando cuenta…',
      );

      await vi.advanceTimersByTimeAsync(1200);
      fixture.detectChanges();

      expect(successSpy).toHaveBeenCalledWith('Cuenta eliminada correctamente');
      expect(compiled.querySelector('app-confirm-dialog')).toBeNull();
    });

    it('should keep the dialog open with an inline error when deletion fails', async () => {
      vi.useFakeTimers();
      const fixture = crearFixture();
      TestBed.inject(MockScenarioService).set('error');

      const compiled = fixture.nativeElement as HTMLElement;
      compiled.querySelector<HTMLButtonElement>('.account-row--danger')?.click();
      fixture.detectChanges();
      compiled.querySelector<HTMLButtonElement>('.confirm-dialog .btn-danger')?.click();
      fixture.detectChanges();

      await vi.advanceTimersByTimeAsync(1200);
      fixture.detectChanges();

      expect(compiled.querySelector('app-confirm-dialog')).not.toBeNull();
      expect(compiled.querySelector('.confirm-dialog__error')?.textContent).toContain(
        'No se pudo eliminar la cuenta',
      );
    });
  });
});
