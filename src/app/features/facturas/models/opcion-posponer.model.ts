export type OpcionPosponer = '1-hora' | '1-dia' | 'no-recordar';

export const ETIQUETAS_POSPONER: Record<OpcionPosponer, string> = {
  '1-hora': 'En 1 hora',
  '1-dia': 'En 1 día',
  'no-recordar': 'No recordarme más',
};

export const OPCIONES_POSPONER: readonly {
  readonly valor: OpcionPosponer;
  readonly etiqueta: string;
}[] = [
  { valor: '1-hora', etiqueta: ETIQUETAS_POSPONER['1-hora'] },
  { valor: '1-dia', etiqueta: ETIQUETAS_POSPONER['1-dia'] },
  { valor: 'no-recordar', etiqueta: ETIQUETAS_POSPONER['no-recordar'] },
];
