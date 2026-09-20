import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastService } from '../../../../core/services/toast.service';
import { Icon } from '../../../../shared/components/icon/icon';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { IDIOMAS_MOCK } from '../../data/idiomas.mock';
import { MONEDAS_MOCK } from '../../data/monedas.mock';
import { CodigoIdioma } from '../../models/idioma.model';
import { CodigoMoneda } from '../../models/moneda.model';
import { cambioContrasenaValidator } from '../../services/cambio-contrasena.validator';
import { EliminarCuentaService } from '../../services/eliminar-cuenta.service';
import { GuardarConfiguracionService } from '../../services/guardar-configuracion.service';

interface CambiarContrasenaControls {
  actual: FormControl<string>;
  nueva: FormControl<string>;
  confirmar: FormControl<string>;
}

const MENSAJES_ERROR_CONTRASENA: Record<string, string> = {
  camposIncompletos: 'Completa los tres campos para cambiar tu contraseña.',
  longitudMinima: 'La nueva contraseña debe tener al menos 8 caracteres.',
  noCoincide: 'Las contraseñas no coinciden.',
};

@Component({
  selector: 'app-configuracion-page',
  imports: [ReactiveFormsModule, Icon, ConfirmDialog],
  templateUrl: './configuracion-page.html',
  styleUrl: './configuracion-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguracionPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly guardarConfiguracionService = inject(GuardarConfiguracionService);
  private readonly eliminarCuentaService = inject(EliminarCuentaService);
  private readonly toastService = inject(ToastService);

  protected readonly idiomas = IDIOMAS_MOCK;
  protected readonly monedas = MONEDAS_MOCK;

  protected readonly idioma = signal<CodigoIdioma>('es-CO');
  protected readonly moneda = signal<CodigoMoneda>('COP');
  protected readonly guardandoIdioma = signal(false);
  protected readonly guardandoMoneda = signal(false);

  protected readonly mostrarCambiarContrasena = signal(false);
  protected readonly guardandoContrasena = signal(false);

  protected readonly mostrarModalEliminar = signal(false);
  protected readonly eliminando = signal(false);
  protected readonly errorEliminar = signal<string | null>(null);

  protected readonly formContrasena = new FormGroup<CambiarContrasenaControls>(
    {
      actual: this.fb.control(''),
      nueva: this.fb.control(''),
      confirmar: this.fb.control(''),
    },
    { validators: [cambioContrasenaValidator()] },
  );

  protected cambiarIdioma(event: Event): void {
    const anterior = this.idioma();
    const nuevoValor = (event.target as HTMLSelectElement).value as CodigoIdioma;
    this.idioma.set(nuevoValor);
    this.guardandoIdioma.set(true);

    this.guardarConfiguracionService.guardar({ idioma: nuevoValor }).subscribe({
      next: () => {
        this.guardandoIdioma.set(false);
        this.toastService.success('Idioma actualizado correctamente');
      },
      error: () => {
        this.guardandoIdioma.set(false);
        this.idioma.set(anterior);
        this.toastService.error('No se pudo actualizar el idioma. Intenta de nuevo.');
      },
    });
  }

  protected cambiarMoneda(event: Event): void {
    const anterior = this.moneda();
    const nuevoValor = (event.target as HTMLSelectElement).value as CodigoMoneda;
    this.moneda.set(nuevoValor);
    this.guardandoMoneda.set(true);

    this.guardarConfiguracionService.guardar({ moneda: nuevoValor }).subscribe({
      next: () => {
        this.guardandoMoneda.set(false);
        this.toastService.success('Moneda actualizada correctamente');
      },
      error: () => {
        this.guardandoMoneda.set(false);
        this.moneda.set(anterior);
        this.toastService.error('No se pudo actualizar la moneda. Intenta de nuevo.');
      },
    });
  }

  protected toggleCambiarContrasena(): void {
    this.mostrarCambiarContrasena.update((abierto) => !abierto);
  }

  protected cancelarCambiarContrasena(): void {
    this.formContrasena.reset({ actual: '', nueva: '', confirmar: '' });
    this.mostrarCambiarContrasena.set(false);
  }

  protected formContrasenaCompleto(): boolean {
    return this.formContrasena.valid && this.formContrasena.controls.nueva.value !== '';
  }

  protected mostrarErrorContrasena(): boolean {
    return (
      this.formContrasena.invalid && (this.formContrasena.dirty || this.formContrasena.touched)
    );
  }

  protected mensajeErrorContrasena(): string {
    const errores = this.formContrasena.errors;
    const clave = errores ? Object.keys(errores)[0] : undefined;
    return clave ? MENSAJES_ERROR_CONTRASENA[clave] : '';
  }

  protected guardarContrasena(): void {
    if (!this.formContrasenaCompleto() || this.guardandoContrasena()) {
      this.formContrasena.markAllAsTouched();
      return;
    }

    const nuevaContrasena = this.formContrasena.controls.nueva.value;
    this.guardandoContrasena.set(true);

    this.guardarConfiguracionService.guardar({ nuevaContrasena }).subscribe({
      next: () => {
        this.guardandoContrasena.set(false);
        this.formContrasena.reset({ actual: '', nueva: '', confirmar: '' });
        this.mostrarCambiarContrasena.set(false);
        this.toastService.success('Contraseña actualizada correctamente');
      },
      error: () => {
        this.guardandoContrasena.set(false);
        this.toastService.error('No se pudo actualizar la contraseña. Intenta de nuevo.');
      },
    });
  }

  protected abrirModalEliminar(): void {
    this.errorEliminar.set(null);
    this.mostrarModalEliminar.set(true);
  }

  protected cerrarModalEliminar(): void {
    this.mostrarModalEliminar.set(false);
    this.errorEliminar.set(null);
  }

  protected confirmarEliminarCuenta(): void {
    if (this.eliminando()) {
      return;
    }

    this.eliminando.set(true);
    this.errorEliminar.set(null);

    this.eliminarCuentaService.eliminar().subscribe({
      next: () => {
        this.eliminando.set(false);
        this.mostrarModalEliminar.set(false);
        this.toastService.success('Cuenta eliminada correctamente');
      },
      error: () => {
        this.eliminando.set(false);
        this.errorEliminar.set('No se pudo eliminar la cuenta. Intenta de nuevo.');
      },
    });
  }

  protected cerrarSesion(): void {
    this.toastService.success('Sesión cerrada correctamente');
  }
}
