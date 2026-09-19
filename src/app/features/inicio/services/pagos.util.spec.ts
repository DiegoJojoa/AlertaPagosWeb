import { Pago } from '../models/pago.model';
import { calcularResumenPagos, esPagoUrgente, ordenarPorVencimiento } from './pagos.util';

function crearPago(overrides: Partial<Pago>): Pago {
  return {
    id: 'pago-test',
    proveedor: 'Proveedor de prueba',
    monto: 1000,
    fechaVencimiento: new Date('2026-09-20'),
    estado: 'pendiente',
    ...overrides,
  };
}

describe('calcularResumenPagos', () => {
  it('should sum count and amount per estado', () => {
    const pagos: Pago[] = [
      crearPago({ id: '1', estado: 'pendiente', monto: 100 }),
      crearPago({ id: '2', estado: 'pendiente', monto: 200 }),
      crearPago({ id: '3', estado: 'pagada', monto: 500 }),
      crearPago({ id: '4', estado: 'vencida', monto: 50 }),
    ];

    const resumen = calcularResumenPagos(pagos);

    expect(resumen.pendientes).toEqual({ cantidad: 2, total: 300 });
    expect(resumen.pagadas).toEqual({ cantidad: 1, total: 500 });
    expect(resumen.vencidas).toEqual({ cantidad: 1, total: 50 });
  });

  it('should return zeroed items when there are no pagos', () => {
    const resumen = calcularResumenPagos([]);

    expect(resumen).toEqual({
      pendientes: { cantidad: 0, total: 0 },
      pagadas: { cantidad: 0, total: 0 },
      vencidas: { cantidad: 0, total: 0 },
    });
  });
});

describe('ordenarPorVencimiento', () => {
  it('should sort by fechaVencimiento ascending without mutating the input', () => {
    const pagos: Pago[] = [
      crearPago({ id: 'tarde', fechaVencimiento: new Date('2026-09-30') }),
      crearPago({ id: 'pronto', fechaVencimiento: new Date('2026-09-10') }),
      crearPago({ id: 'medio', fechaVencimiento: new Date('2026-09-20') }),
    ];
    const original = [...pagos];

    const ordenados = ordenarPorVencimiento(pagos);

    expect(ordenados.map((pago) => pago.id)).toEqual(['pronto', 'medio', 'tarde']);
    expect(pagos).toEqual(original);
  });
});

describe('esPagoUrgente', () => {
  const ahora = new Date('2026-09-19T00:00:00');

  it('should be true for a pendiente payment due within the threshold', () => {
    const pago = crearPago({ estado: 'pendiente', fechaVencimiento: new Date('2026-09-21') });
    expect(esPagoUrgente(pago, 3, ahora)).toBe(true);
  });

  it('should be false for a pendiente payment due far in the future', () => {
    const pago = crearPago({ estado: 'pendiente', fechaVencimiento: new Date('2026-10-10') });
    expect(esPagoUrgente(pago, 3, ahora)).toBe(false);
  });

  it('should be false for a payment that is not pendiente, regardless of date', () => {
    const pago = crearPago({ estado: 'vencida', fechaVencimiento: new Date('2026-09-20') });
    expect(esPagoUrgente(pago, 3, ahora)).toBe(false);
  });
});
