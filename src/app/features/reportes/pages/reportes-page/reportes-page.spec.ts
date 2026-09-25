import { TestBed } from '@angular/core/testing';
import { ReportesPage } from './reportes-page';

describe('ReportesPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ReportesPage] }).compileComponents();
  });

  it('renders the default monthly report', () => {
    const fixture = TestBed.createComponent(ReportesPage);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Resumen del mes');
    expect(text).toContain('$420.000');
    expect(text).toContain('$285.000');
    expect(text).toContain('$54.000');
  });

  it('applies the annual report without navigating', () => {
    const fixture = TestBed.createComponent(ReportesPage);
    fixture.detectChanges();
    const buttons = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button'));
    buttons.find((button) => button.textContent?.includes('Año'))?.click();
    fixture.detectChanges();
    buttons.find((button) => button.textContent?.includes('Aplicar'))?.click();
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Resumen del año');
    expect(text).toContain('$4.250.000');
  });

  it('shows the empty state for a month without data', () => {
    const fixture = TestBed.createComponent(ReportesPage);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    root.querySelector<HTMLButtonElement>('[aria-label="Mes anterior"]')?.click();
    fixture.detectChanges();
    Array.from(root.querySelectorAll('button'))
      .find((button) => button.textContent?.includes('Aplicar'))
      ?.click();
    fixture.detectChanges();
    expect(root.textContent).toContain('No hay pagos registrados en este periodo');
  });

  it('clears filters and restores the monthly report', () => {
    const fixture = TestBed.createComponent(ReportesPage);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    Array.from(root.querySelectorAll('button'))
      .find((button) => button.textContent?.includes('Año'))
      ?.click();
    Array.from(root.querySelectorAll('button'))
      .find((button) => button.textContent?.includes('Aplicar'))
      ?.click();
    Array.from(root.querySelectorAll('button'))
      .find((button) => button.textContent?.includes('Limpiar'))
      ?.click();
    fixture.detectChanges();
    expect(root.textContent).toContain('Resumen del mes');
    expect(root.querySelector('[aria-pressed="true"]')?.textContent).toContain('Mes');
  });
});
