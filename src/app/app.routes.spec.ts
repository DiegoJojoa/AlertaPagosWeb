import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

describe('app routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
  });

  it('should redirect the empty path to Inicio', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    expect(harness.routeNativeElement?.textContent).toContain('Inicio');
  });

  it('should lazy-load the Reportes page for /reportes', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/reportes');
    expect(harness.routeNativeElement?.textContent).toContain('Reportes');
  });

  it('should render the not-found page for an unknown route', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/ruta-que-no-existe');
    expect(harness.routeNativeElement?.textContent).toContain('Página no encontrada');
  });

  it('should resolve /facturas/nueva to the "nueva" static route, not the ":id" route', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/facturas/nueva');
    expect(harness.routeNativeElement?.textContent).toContain('Agregar pago manual');
  });

  it('should resolve /facturas/:id to the invoice detail page', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/facturas/pago-1');
    expect(harness.routeNativeElement?.textContent).toContain('Volver a facturas');
  });
});
