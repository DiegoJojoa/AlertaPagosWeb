import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  input,
  output,
} from '@angular/core';

export type ConfirmDialogVariant = 'primary' | 'danger';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog implements AfterViewInit {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly confirmLabel = input('Confirmar');
  readonly loadingLabel = input('Procesando…');
  readonly cancelLabel = input('Cancelar');
  readonly variant = input<ConfirmDialogVariant>('primary');
  readonly loading = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

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
}
