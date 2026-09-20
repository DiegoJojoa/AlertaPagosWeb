import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const LONGITUD_MINIMA = 8;

interface CambiarContrasenaValue {
  readonly actual: string;
  readonly nueva: string;
  readonly confirmar: string;
}

/**
 * El cambio de contraseña es opcional: si los tres campos están vacíos, es
 * válido (el usuario no quiere cambiarla). En cuanto escribe en cualquiera,
 * los tres pasan a ser obligatorios, la nueva debe tener al menos 8
 * caracteres, y debe coincidir con la confirmación.
 */
export function cambioContrasenaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const { actual, nueva, confirmar } = control.value as CambiarContrasenaValue;

    const algunoConContenido = !!actual || !!nueva || !!confirmar;
    if (!algunoConContenido) {
      return null;
    }

    if (!actual || !nueva || !confirmar) {
      return { camposIncompletos: true };
    }

    if (nueva.length < LONGITUD_MINIMA) {
      return { longitudMinima: true };
    }

    if (nueva !== confirmar) {
      return { noCoincide: true };
    }

    return null;
  };
}
