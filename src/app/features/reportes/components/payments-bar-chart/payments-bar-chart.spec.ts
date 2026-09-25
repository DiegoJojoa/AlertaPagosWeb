import { TestBed } from '@angular/core/testing';
import { REPORTE_MES, REPORTE_VACIO } from '../../data/reportes.mock';
import { PaymentsBarChart } from './payments-bar-chart';

describe('PaymentsBarChart', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PaymentsBarChart] }).compileComponents();
  });

  it('scales bars relative to the largest count', () => {
    const fixture = TestBed.createComponent(PaymentsBarChart);
    fixture.componentRef.setInput('summary', REPORTE_MES);
    fixture.detectChanges();
    const bars = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
      '.chart__bar',
    );
    expect(bars[0].style.height).toBe('120px');
    expect(bars[1].style.height).toBe('72px');
    expect(bars[2].style.height).toBe('24px');
  });

  it('renders the empty state when every count is zero', () => {
    const fixture = TestBed.createComponent(PaymentsBarChart);
    fixture.componentRef.setInput('summary', REPORTE_VACIO);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'No hay pagos registrados',
    );
  });
});
