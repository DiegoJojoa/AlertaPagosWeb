import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ResumenReporte } from '../../models/reporte.model';

interface ReportBar {
  readonly label: string;
  readonly value: number;
  readonly variant: 'pagada' | 'pendiente' | 'vencida';
  readonly height: number;
}

@Component({
  selector: 'app-payments-bar-chart',
  templateUrl: './payments-bar-chart.html',
  styleUrl: './payments-bar-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentsBarChart {
  readonly summary = input.required<ResumenReporte>();

  protected readonly hasData = computed(() =>
    Object.values(this.summary()).some((item) => item.cantidad > 0),
  );

  protected readonly bars = computed<readonly ReportBar[]>(() => {
    const summary = this.summary();
    const max = Math.max(
      summary.pagadas.cantidad,
      summary.pendientes.cantidad,
      summary.vencidas.cantidad,
      1,
    );

    return [
      this.createBar('Pagadas', summary.pagadas.cantidad, 'pagada', max),
      this.createBar('Pendientes', summary.pendientes.cantidad, 'pendiente', max),
      this.createBar('Vencidas', summary.vencidas.cantidad, 'vencida', max),
    ];
  });

  private createBar(
    label: string,
    value: number,
    variant: ReportBar['variant'],
    max: number,
  ): ReportBar {
    return { label, value, variant, height: Math.round((value / max) * 120) };
  }
}
