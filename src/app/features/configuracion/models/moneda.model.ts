export type CodigoMoneda = 'COP' | 'USD';

export interface OpcionMoneda {
  readonly codigo: CodigoMoneda;
  readonly etiqueta: string;
}
