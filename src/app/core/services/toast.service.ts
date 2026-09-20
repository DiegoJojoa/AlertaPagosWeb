import { Injectable, signal } from '@angular/core';
import { ToastMessage, ToastVariant } from './toast.model';

const DURACION_POR_DEFECTO_MS = 3500;

/**
 * Notificaciones tipo toast, compartidas por cualquier feature que necesite
 * confirmar una acción local (guardar, pagar, posponer, anular, etc.).
 * Se renderizan una sola vez en la raíz de la app (ver ToastContainer).
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toasts = signal<readonly ToastMessage[]>([]);
  private nextId = 0;

  readonly activeToasts = this.toasts.asReadonly();

  success(text: string, durationMs = DURACION_POR_DEFECTO_MS): void {
    this.show(text, 'success', durationMs);
  }

  error(text: string, durationMs = DURACION_POR_DEFECTO_MS): void {
    this.show(text, 'error', durationMs);
  }

  dismiss(id: number): void {
    this.toasts.update((current) => current.filter((toast) => toast.id !== id));
  }

  private show(text: string, variant: ToastVariant, durationMs: number): void {
    const id = ++this.nextId;
    this.toasts.update((current) => [...current, { id, text, variant }]);
    setTimeout(() => this.dismiss(id), durationMs);
  }
}
