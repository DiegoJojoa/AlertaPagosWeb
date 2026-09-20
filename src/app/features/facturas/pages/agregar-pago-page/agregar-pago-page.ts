import { toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { ToastService } from '../../../../core/services/toast.service';
import { CurrencyInputDirective } from '../../../../shared/directives/currency-input.directive';
import { TIPOS_SERVICIO_MOCK } from '../../data/tipos-servicio.mock';
import { NuevoPagoManual } from '../../models/nuevo-pago-manual.model';
import { TipoServicio } from '../../models/tipo-servicio.model';
import { GuardarPagoManualService } from '../../services/guardar-pago-manual.service';

interface AgregarPagoFormControls {
  proveedor: FormControl<string>;
  tipoServicio: FormControl<TipoServicio | null>;
  monto: FormControl<number | null>;
  fecha: FormControl<string>;
  notas: FormControl<string>;
}

type NombreCampo = keyof AgregarPagoFormControls;

const MENSAJES_ERROR: Record<NombreCampo, string> = {
  proveedor: 'El proveedor es obligatorio.',
  tipoServicio: 'Selecciona un tipo de servicio.',
  monto: 'El monto es obligatorio.',
  fecha: 'La fecha es obligatoria.',
  notas: '',
};

@Component({
  selector: 'app-agregar-pago-page',
  imports: [ReactiveFormsModule, RouterLink, CurrencyInputDirective],
  templateUrl: './agregar-pago-page.html',
  styleUrl: './agregar-pago-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgregarPagoPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly guardarPagoService = inject(GuardarPagoManualService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly tiposServicio = TIPOS_SERVICIO_MOCK;
  protected readonly guardando = signal(false);
  protected readonly errorGuardado = signal<string | null>(null);

  protected readonly form = new FormGroup<AgregarPagoFormControls>({
    proveedor: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    tipoServicio: new FormControl<TipoServicio | null>(null, {
      validators: [Validators.required],
    }),
    monto: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
    }),
    fecha: this.fb.control('', { validators: [Validators.required] }),
    notas: this.fb.control(''),
  });

  protected readonly formValido = toSignal(
    this.form.statusChanges.pipe(map((estado) => estado === 'VALID')),
    { initialValue: this.form.valid },
  );

  protected mostrarError(campo: NombreCampo): boolean {
    const control = this.form.controls[campo];
    return control.invalid && (control.dirty || control.touched);
  }

  protected mensajeError(campo: NombreCampo): string {
    return MENSAJES_ERROR[campo];
  }

  protected guardar(): void {
    if (!this.form.valid || this.guardando()) {
      this.form.markAllAsTouched();
      return;
    }

    const { proveedor, tipoServicio, monto, fecha, notas } = this.form.getRawValue();
    const datos: NuevoPagoManual = {
      proveedor,
      tipoServicio: tipoServicio!,
      monto: monto!,
      fecha,
      notas,
    };

    this.guardando.set(true);
    this.errorGuardado.set(null);

    this.guardarPagoService.guardar(datos).subscribe({
      next: () => {
        this.guardando.set(false);
        this.toastService.success('Pago manual guardado correctamente');
        this.router.navigateByUrl('/inicio');
      },
      error: () => {
        this.guardando.set(false);
        this.errorGuardado.set('No se pudo guardar el pago. Intenta de nuevo.');
      },
    });
  }
}
