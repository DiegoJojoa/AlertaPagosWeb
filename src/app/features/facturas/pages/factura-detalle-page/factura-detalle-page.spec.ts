import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { FacturaDetallePage } from './factura-detalle-page';

function crearFixture(id: string | null) {
  TestBed.configureTestingModule({
    imports: [FacturaDetallePage],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: { paramMap: of(convertToParamMap(id ? { id } : {})) },
      },
    ],
  });
  const fixture = TestBed.createComponent(FacturaDetallePage);
  fixture.detectChanges();
  return fixture;
}

describe('FacturaDetallePage', () => {
  it('should mention the invoice id from the route in the subtitle', () => {
    const fixture = crearFixture('pago-1');
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.page__subtitle')?.textContent).toContain('pago-1');
  });

  it('should fall back to a generic message when there is no id', () => {
    const fixture = crearFixture(null);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.page__subtitle')?.textContent).toBe(
      'Esta sección estará disponible próximamente.',
    );
  });
});
