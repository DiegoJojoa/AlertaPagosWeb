import { FormControl, FormGroup } from '@angular/forms';
import { cambioContrasenaValidator } from './cambio-contrasena.validator';

function crearGrupo(actual: string, nueva: string, confirmar: string): FormGroup {
  return new FormGroup(
    {
      actual: new FormControl(actual, { nonNullable: true }),
      nueva: new FormControl(nueva, { nonNullable: true }),
      confirmar: new FormControl(confirmar, { nonNullable: true }),
    },
    { validators: [cambioContrasenaValidator()] },
  );
}

describe('cambioContrasenaValidator', () => {
  it('should be valid when all three fields are empty (no password change requested)', () => {
    const grupo = crearGrupo('', '', '');
    expect(grupo.valid).toBe(true);
  });

  it('should require all three fields once any of them has content', () => {
    const grupo = crearGrupo('claveActual1', '', '');
    expect(grupo.errors).toEqual({ camposIncompletos: true });
  });

  it('should require the new password to be at least 8 characters long', () => {
    const grupo = crearGrupo('claveActual1', 'corta1', 'corta1');
    expect(grupo.errors).toEqual({ longitudMinima: true });
  });

  it('should require the confirmation to match the new password', () => {
    const grupo = crearGrupo('claveActual1', 'contrasenaNueva1', 'otraDistinta1');
    expect(grupo.errors).toEqual({ noCoincide: true });
  });

  it('should be valid when all fields are filled, long enough and matching', () => {
    const grupo = crearGrupo('claveActual1', 'contrasenaNueva1', 'contrasenaNueva1');
    expect(grupo.valid).toBe(true);
  });

  it('should re-validate reactively when a sibling control changes', () => {
    const grupo = crearGrupo('claveActual1', 'contrasenaNueva1', 'contrasenaNueva1');
    expect(grupo.valid).toBe(true);

    grupo.controls['confirmar'].setValue('otraDistinta1');

    expect(grupo.errors).toEqual({ noCoincide: true });
  });
});
