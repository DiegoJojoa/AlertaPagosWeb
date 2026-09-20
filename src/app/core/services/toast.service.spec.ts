import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, vi } from 'vitest';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should add a success toast with the given text', () => {
    service.success('Pago manual guardado correctamente');

    expect(service.activeToasts()).toEqual([
      { id: 1, text: 'Pago manual guardado correctamente', variant: 'success' },
    ]);
  });

  it('should add an error toast', () => {
    service.error('No se pudo guardar el pago.');

    expect(service.activeToasts()[0].variant).toBe('error');
  });

  it('should auto-dismiss a toast after its duration elapses', () => {
    service.success('Se va a ocultar', 1000);
    expect(service.activeToasts().length).toBe(1);

    vi.advanceTimersByTime(1000);

    expect(service.activeToasts().length).toBe(0);
  });

  it('should allow manual dismissal before the timer fires', () => {
    service.success('Uno');
    service.success('Dos');
    const [primero] = service.activeToasts();

    service.dismiss(primero.id);

    expect(service.activeToasts().map((t) => t.text)).toEqual(['Dos']);
  });
});
