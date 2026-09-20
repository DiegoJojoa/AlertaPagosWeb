import { CodigoIdioma } from './idioma.model';
import { CodigoMoneda } from './moneda.model';

/**
 * Cada acción de guardado envía solo el campo que cambió (idioma, moneda o
 * contraseña se guardan de forma independiente, no en un único formulario).
 */
export interface ActualizarConfiguracion {
  readonly idioma?: CodigoIdioma;
  readonly moneda?: CodigoMoneda;
  readonly nuevaContrasena?: string;
}
