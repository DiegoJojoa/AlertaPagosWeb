import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MainLayout } from './main-layout';

describe('MainLayout', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayout],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should open the sidebar when the header toggle is clicked, and close it on backdrop click', () => {
    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();

    const nativeEl = fixture.nativeElement as HTMLElement;
    const navToggle = nativeEl.querySelector<HTMLButtonElement>('.header__nav-toggle');

    expect(nativeEl.querySelector('.sidebar-nav--open')).toBeNull();

    navToggle?.click();
    fixture.detectChanges();
    expect(nativeEl.querySelector('.sidebar-nav--open')).not.toBeNull();

    nativeEl.querySelector<HTMLElement>('.sidebar-nav__backdrop')?.click();
    fixture.detectChanges();
    expect(nativeEl.querySelector('.sidebar-nav--open')).toBeNull();
  });
});
