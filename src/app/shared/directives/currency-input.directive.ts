import { Directive, ElementRef, HostListener, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const FORMATO_MILES = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

function noop(): void {
  /* sin operación: valor por defecto hasta que Angular registre el callback real */
}

/**
 * Formatea un input de texto como monto en pesos mientras se escribe
 * (separador de miles), manteniendo un número plano en el FormControl.
 */
@Directive({
  selector: 'input[appCurrencyInput]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyInputDirective),
      multi: true,
    },
  ],
})
export class CurrencyInputDirective implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);

  private onChange: (value: number | null) => void = noop;
  private onTouched: () => void = noop;

  @HostListener('input', ['$event'])
  protected onInput(event: Event): void {
    const rawValue = (event.target as HTMLInputElement).value;
    const digitos = rawValue.replace(/\D/g, '');
    const valor = digitos ? Number(digitos) : null;

    this.onChange(valor);
    this.renderizar(valor);
  }

  @HostListener('blur')
  protected onBlur(): void {
    this.onTouched();
  }

  writeValue(value: number | null): void {
    this.renderizar(value);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled;
  }

  private renderizar(value: number | null): void {
    const texto = value === null || value === undefined ? '' : FORMATO_MILES.format(value);
    this.elementRef.nativeElement.value = texto;
    this.elementRef.nativeElement.setSelectionRange(texto.length, texto.length);
  }
}
