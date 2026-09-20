export type CodigoIdioma = 'es-CO' | 'en-US' | 'pt-BR' | 'fr-FR';

export interface OpcionIdioma {
  readonly codigo: CodigoIdioma;
  readonly etiqueta: string;
}
