import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ConfirmDialog } from './confirm-dialog';

function crearFixture() {
  TestBed.configureTestingModule({ imports: [ConfirmDialog] });
  const fixture = TestBed.createComponent(ConfirmDialog);
  fixture.componentRef.setInput('title', '¿Eliminar tu cuenta?');
  fixture.componentRef.setInput(
    'description',
    'Esta acción no se puede deshacer. Perderás tu historial de pagos y recordatorios configurados.',
  );
  fixture.componentRef.setInput('confirmLabel', 'Eliminar cuenta');
  fixture.componentRef.setInput('variant', 'danger');
  fixture.detectChanges();
  return fixture;
}

describe('ConfirmDialog', () => {
  it('should render the title, description and danger confirm button', () => {
    const fixture = crearFixture();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.confirm-dialog__title')?.textContent).toBe(
      '¿Eliminar tu cuenta?',
    );
    expect(compiled.querySelector('.btn-danger')?.textContent?.trim()).toBe('Eliminar cuenta');
  });

  it('should emit cancelled when the cancel button is clicked', () => {
    const fixture = crearFixture();
    const emitted = vi.fn();
    fixture.componentInstance.cancelled.subscribe(emitted);

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('.btn-outlined')?.click();

    expect(emitted).toHaveBeenCalledTimes(1);
  });

  it('should emit cancelled when the backdrop is clicked', () => {
    const fixture = crearFixture();
    const emitted = vi.fn();
    fixture.componentInstance.cancelled.subscribe(emitted);

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('.confirm-dialog__backdrop')?.click();

    expect(emitted).toHaveBeenCalledTimes(1);
  });

  it('should emit confirmed when the confirm button is clicked', () => {
    const fixture = crearFixture();
    const emitted = vi.fn();
    fixture.componentInstance.confirmed.subscribe(emitted);

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('.btn-danger')?.click();

    expect(emitted).toHaveBeenCalledTimes(1);
  });

  it('should disable both buttons and show the loading label while loading, and ignore Escape/backdrop', () => {
    const fixture = crearFixture();
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('loadingLabel', 'Eliminando cuenta…');
    fixture.detectChanges();

    const emitted = vi.fn();
    fixture.componentInstance.cancelled.subscribe(emitted);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector<HTMLButtonElement>('.btn-outlined')?.disabled).toBe(true);
    expect(compiled.querySelector<HTMLButtonElement>('.btn-danger')?.disabled).toBe(true);
    expect(compiled.querySelector('.btn-danger')?.textContent?.trim()).toBe('Eliminando cuenta…');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    compiled.querySelector<HTMLButtonElement>('.confirm-dialog__backdrop')?.click();
    expect(emitted).not.toHaveBeenCalled();
  });

  it('should show the error message when provided', () => {
    const fixture = crearFixture();
    fixture.componentRef.setInput('errorMessage', 'No se pudo eliminar la cuenta.');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.confirm-dialog__error')?.textContent).toBe(
      'No se pudo eliminar la cuenta.',
    );
  });
});
