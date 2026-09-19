import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { SidebarNav } from './sidebar-nav';

describe('SidebarNav', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarNav],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
  });

  it('should render the four main navigation links in order', () => {
    const fixture = TestBed.createComponent(SidebarNav);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll<HTMLAnchorElement>('.sidebar-nav__link');
    const labels = Array.from(links).map((link) => link.textContent?.trim());

    expect(labels).toEqual(['Inicio', 'Facturas', 'Reportes', 'Configuración']);
  });

  it('should emit closeRequested when a link is clicked', async () => {
    const fixture = TestBed.createComponent(SidebarNav);
    fixture.detectChanges();
    const emitted = vi.fn();
    fixture.componentInstance.closeRequested.subscribe(emitted);

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLAnchorElement>('.sidebar-nav__link')?.click();
    await fixture.whenStable();

    expect(emitted).toHaveBeenCalledTimes(1);
  });

  it('should emit closeRequested on Escape only when open', () => {
    const fixture = TestBed.createComponent(SidebarNav);
    fixture.detectChanges();
    const emitted = vi.fn();
    fixture.componentInstance.closeRequested.subscribe(emitted);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(emitted).not.toHaveBeenCalled();

    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(emitted).toHaveBeenCalledTimes(1);
  });
});
