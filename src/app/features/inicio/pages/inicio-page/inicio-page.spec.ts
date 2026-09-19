import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, Subject, of, throwError } from 'rxjs';
import { Pago } from '../../models/pago.model';
import { PagosService } from '../../services/pagos.service';
import { InicioPage } from './inicio-page';

interface FakePagosService {
  obtenerPagos(): Observable<Pago[]>;
}

const PAGOS_MOCK: Pago[] = [
  {
    id: '1',
    proveedor: 'Energía',
    monto: 120000,
    fechaVencimiento: new Date(Date.now() + 2 * 86_400_000),
    estado: 'pendiente',
  },
  {
    id: '2',
    proveedor: 'Arriendo',
    monto: 650000,
    fechaVencimiento: new Date(Date.now() - 10 * 86_400_000),
    estado: 'pagada',
  },
];

function crearFixture(fakePagosService: FakePagosService): ComponentFixture<InicioPage> {
  TestBed.configureTestingModule({
    imports: [InicioPage],
    providers: [provideRouter([]), { provide: PagosService, useValue: fakePagosService }],
  });
  const fixture = TestBed.createComponent(InicioPage);
  fixture.detectChanges();
  return fixture;
}

describe('InicioPage', () => {
  it('should show the loading skeleton while pagos have not resolved yet', () => {
    const pagos$ = new Subject<Pago[]>();
    const fixture = crearFixture({ obtenerPagos: () => pagos$.asObservable() });

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.skeleton-stats')).not.toBeNull();
  });

  it('should render stat cards and only the pending payments once data arrives', () => {
    const pagos$ = new Subject<Pago[]>();
    const fixture = crearFixture({ obtenerPagos: () => pagos$.asObservable() });

    pagos$.next(PAGOS_MOCK);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('app-stat-card').length).toBe(3);
    expect(compiled.querySelectorAll('app-payment-list-item').length).toBe(1);
    expect(compiled.querySelector('.btn-primary')?.getAttribute('href')).toBe('/facturas/nueva');
  });

  it('should render the empty state when there are no pending payments', () => {
    const pagos$ = new Subject<Pago[]>();
    const fixture = crearFixture({ obtenerPagos: () => pagos$.asObservable() });

    pagos$.next([]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.page__empty')).not.toBeNull();
    expect(compiled.querySelector('.page__empty-title')?.textContent).toContain(
      'No tienes pagos pendientes',
    );
  });

  it('should render an error message and retry the request on click', () => {
    let intentos = 0;
    const fixture = crearFixture({
      obtenerPagos: () => {
        intentos += 1;
        return intentos === 1 ? throwError(() => new Error('falló')) : of(PAGOS_MOCK);
      },
    });

    let compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.page__error')).not.toBeNull();

    compiled.querySelector<HTMLButtonElement>('.btn-outlined')?.click();
    fixture.detectChanges();

    compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.page__error')).toBeNull();
    expect(compiled.querySelectorAll('app-stat-card').length).toBe(3);
    expect(intentos).toBe(2);
  });
});
