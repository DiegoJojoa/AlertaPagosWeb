export type ToastVariant = 'success' | 'error' | 'warning' | 'danger';

export interface ToastMessage {
  readonly id: number;
  readonly text: string;
  readonly variant: ToastVariant;
}
