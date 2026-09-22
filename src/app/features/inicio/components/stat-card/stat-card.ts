import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MontoPipe } from '../../../../shared/pipes/monto.pipe';

export type StatCardVariant = 'pendiente' | 'pagada' | 'vencida';
export type StatCardAppearance = 'dashboard' | 'report';

const VARIANT_LABELS: Record<StatCardVariant, string> = {
  pendiente: 'Pendientes',
  pagada: 'Pagadas',
  vencida: 'Vencidas',
};

@Component({
  selector: 'app-stat-card',
  imports: [MontoPipe],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  readonly variant = input.required<StatCardVariant>();
  readonly cantidad = input.required<number>();
  readonly total = input.required<number>();
  readonly appearance = input<StatCardAppearance>('dashboard');

  protected readonly label = computed(() => VARIANT_LABELS[this.variant()]);
}
