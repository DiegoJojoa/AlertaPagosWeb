import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../../shared/components/icon/icon';
import { MontoPipe } from '../../../../shared/pipes/monto.pipe';
import { EstadoPago, Pago } from '../../models/pago.model';

const ESTADO_LABELS: Record<EstadoPago, string> = {
  pendiente: 'Pendiente',
  pagada: 'Pagada',
  vencida: 'Vencida',
};

@Component({
  selector: 'app-payment-list-item',
  imports: [DatePipe, MontoPipe, Icon, RouterLink],
  templateUrl: './payment-list-item.html',
  styleUrl: './payment-list-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentListItem {
  readonly pago = input.required<Pago>();
  readonly urgente = input(false);

  protected readonly estadoLabel = computed(() => ESTADO_LABELS[this.pago().estado]);
}
