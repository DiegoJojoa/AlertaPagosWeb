import { Pipe, PipeTransform } from '@angular/core';

const FORMATO_MONTO = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

@Pipe({
  name: 'monto',
})
export class MontoPipe implements PipeTransform {
  transform(valor: number): string {
    return `$${FORMATO_MONTO.format(valor)}`;
  }
}
