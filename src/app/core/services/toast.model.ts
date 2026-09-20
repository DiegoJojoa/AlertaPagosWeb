export type ToastVariant = 'success' | 'error';

export interface ToastMessage {
  readonly id: number;
  readonly text: string;
  readonly variant: ToastVariant;
}
