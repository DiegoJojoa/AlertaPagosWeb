import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../../shared/components/icon/icon';
import { MontoPipe } from '../../../../shared/pipes/monto.pipe';
import { EstadoFactura, FacturaListado } from '../../models/factura.model';

const ESTADO_LABELS: Record<EstadoFactura, string> = {
  pendiente: 'Pendiente',
  pagada: 'Pagada',
  vencida: 'Vencida',
  anulada: 'Anulada',
};

@Component({
  selector: 'app-invoice-list-row',
  imports: [DatePipe, RouterLink, Icon, MontoPipe],
  templateUrl: './invoice-list-row.html',
  styleUrl: './invoice-list-row.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceListRow {
  readonly factura = input.required<FacturaListado>();
  protected readonly estadoLabel = computed(() => ESTADO_LABELS[this.factura().estado]);
}
