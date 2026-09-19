import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Header } from './header';

describe('Header', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
    }).compileComponents();
  });

  it('should render the app brand name', () => {
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.header__brand')?.textContent?.trim()).toBe('AlertaPagos');
  });

  it('should emit toggleNav when the nav toggle button is clicked', () => {
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    const emitted = vi.fn();
    fixture.componentInstance.toggleNav.subscribe(emitted);

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector<HTMLButtonElement>('.header__nav-toggle');
    button?.click();

    expect(emitted).toHaveBeenCalledTimes(1);
  });

  it('should reflect isNavOpen in aria-expanded on the toggle button', () => {
    const fixture = TestBed.createComponent(Header);
    fixture.componentRef.setInput('isNavOpen', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector<HTMLButtonElement>('.header__nav-toggle');
    expect(button?.getAttribute('aria-expanded')).toBe('true');
  });
});
