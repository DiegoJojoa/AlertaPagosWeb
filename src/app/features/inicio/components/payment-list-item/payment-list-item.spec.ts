import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Pago } from '../../models/pago.model';
import { PaymentListItem } from './payment-list-item';

const PAGO_BASE: Pago = {
  id: 'pago-1',
  proveedor: 'Energía',
  monto: 120000,
  fechaVencimiento: new Date('2026-09-21'),
  estado: 'pendiente',
};

describe('PaymentListItem', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentListItem],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render provider, amount and status label', () => {
    const fixture = TestBed.createComponent(PaymentListItem);
    fixture.componentRef.setInput('pago', PAGO_BASE);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.payment-item__proveedor')?.textContent).toBe('Energía');
    expect(compiled.querySelector('.payment-item__monto')?.textContent).toBe('$120.000');
    expect(compiled.querySelector('.payment-item__badge')?.textContent?.trim()).toBe('Pendiente');
  });

  it('should link to the invoice detail route for its pago id', () => {
    const fixture = TestBed.createComponent(PaymentListItem);
    fixture.componentRef.setInput('pago', PAGO_BASE);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a.payment-item')?.getAttribute('href')).toBe('/facturas/pago-1');
  });

  it('should show the urgente badge only when urgente is true', () => {
    const fixture = TestBed.createComponent(PaymentListItem);
    fixture.componentRef.setInput('pago', PAGO_BASE);
    fixture.detectChanges();
    let compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.payment-item__urgente-badge')).toBeNull();

    fixture.componentRef.setInput('urgente', true);
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.payment-item__urgente-badge')).not.toBeNull();
  });

  it('should use the estado-specific badge class', () => {
    const fixture = TestBed.createComponent(PaymentListItem);
    fixture.componentRef.setInput('pago', { ...PAGO_BASE, estado: 'vencida' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.payment-item__badge')?.classList).toContain(
      'payment-item__badge--vencida',
    );
  });
});
