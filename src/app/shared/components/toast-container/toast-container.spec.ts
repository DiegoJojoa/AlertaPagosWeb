import { TestBed } from '@angular/core/testing';
import { ToastService } from '../../../core/services/toast.service';
import { ToastContainer } from './toast-container';

describe('ToastContainer', () => {
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastContainer],
    }).compileComponents();
    toastService = TestBed.inject(ToastService);
  });

  it('should render one element per active toast with the correct variant class', () => {
    toastService.success('Pago manual guardado correctamente');
    toastService.error('No se pudo guardar el pago.');
    toastService.warning('Recordatorio pospuesto correctamente');
    toastService.danger('Factura anulada correctamente');

    const fixture = TestBed.createComponent(ToastContainer);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const toasts = compiled.querySelectorAll('.toast');
    expect(toasts.length).toBe(4);
    expect(toasts[0].classList).toContain('toast--success');
    expect(toasts[1].classList).toContain('toast--error');
    expect(toasts[2].classList).toContain('toast--warning');
    expect(toasts[3].classList).toContain('toast--danger');
    expect(toasts[0].textContent).toContain('Pago manual guardado correctamente');
  });

  it('should dismiss a toast when its close button is clicked', () => {
    toastService.success('Se puede cerrar');

    const fixture = TestBed.createComponent(ToastContainer);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('.toast__close')?.click();
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.toast').length).toBe(0);
  });
});
