import { MontoPipe } from './monto.pipe';

describe('MontoPipe', () => {
  const pipe = new MontoPipe();

  it('should format a whole number with thousands separators and a $ prefix', () => {
    expect(pipe.transform(120000)).toBe('$120.000');
  });

  it('should format zero correctly', () => {
    expect(pipe.transform(0)).toBe('$0');
  });

  it('should round to the nearest whole unit', () => {
    expect(pipe.transform(1500.6)).toBe('$1.501');
  });
});
