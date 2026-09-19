import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotFoundPage } from './not-found-page';

describe('NotFoundPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundPage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render a heading and a link back to Inicio', () => {
    const fixture = TestBed.createComponent(NotFoundPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Página no encontrada');

    const link = compiled.querySelector<HTMLAnchorElement>('.not-found__link');
    expect(link?.getAttribute('href')).toBe('/inicio');
  });
});
