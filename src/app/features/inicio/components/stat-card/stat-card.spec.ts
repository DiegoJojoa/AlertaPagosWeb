import { TestBed } from '@angular/core/testing';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCard],
    }).compileComponents();
  });

  it('should render the label, count and formatted total for the "pendiente" variant', () => {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentRef.setInput('variant', 'pendiente');
    fixture.componentRef.setInput('cantidad', 3);
    fixture.componentRef.setInput('total', 285000);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.stat-card__label')?.textContent).toBe('Pendientes');
    expect(compiled.querySelector('.stat-card__count')?.textContent).toBe('3');
    expect(compiled.querySelector('.stat-card__total')?.textContent).toBe('$285.000');
    expect(compiled.querySelector('.stat-card')?.classList).toContain('stat-card--pendiente');
  });

  it('should use the "Vencidas" label for the vencida variant', () => {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentRef.setInput('variant', 'vencida');
    fixture.componentRef.setInput('cantidad', 1);
    fixture.componentRef.setInput('total', 54000);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.stat-card__label')?.textContent).toBe('Vencidas');
  });
});
