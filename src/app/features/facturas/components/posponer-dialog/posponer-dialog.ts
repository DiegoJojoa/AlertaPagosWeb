import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  input,
  output,
  signal,
} from '@angular/core';
import { OPCIONES_POSPONER, OpcionPosponer } from '../../models/opcion-posponer.model';

@Component({
  selector: 'app-posponer-dialog',
  templateUrl: './posponer-dialog.html',
  styleUrl: './posponer-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PosponerDialog implements AfterViewInit {
  readonly loading = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly confirmed = output<OpcionPosponer>();
  readonly cancelled = output<void>();

  protected readonly opciones = OPCIONES_POSPONER;
  protected readonly seleccionada = signal<OpcionPosponer>('1-hora');

  @ViewChild('cancelButton') private readonly cancelButton?: ElementRef<HTMLButtonElement>;

  ngAfterViewInit(): void {
    this.cancelButton?.nativeElement.focus();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (!this.loading()) {
      this.cancelled.emit();
    }
  }

  protected onBackdropClick(): void {
    if (!this.loading()) {
      this.cancelled.emit();
    }
  }

  protected seleccionar(opcion: OpcionPosponer): void {
    this.seleccionada.set(opcion);
  }

  protected confirmar(): void {
    this.confirmed.emit(this.seleccionada());
  }
}
