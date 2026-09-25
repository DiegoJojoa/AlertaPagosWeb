import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { StatCard } from '../../../inicio/components/stat-card/stat-card';
import { PaymentsBarChart } from '../../components/payments-bar-chart/payments-bar-chart';
import { REPORTE_ANIO, REPORTE_MES, REPORTE_RANGO, REPORTE_VACIO } from '../../data/reportes.mock';
import { ReportPeriodType, ReporteAplicado, ResumenReporte } from '../../models/reporte.model';

const DEFAULT_MONTH = new Date(2026, 8, 1);
const DEFAULT_YEAR = 2026;
const DEFAULT_FROM = '2026-06-01';
const DEFAULT_TO = '2026-09-13';

@Component({
  selector: 'app-reportes-page',
  imports: [StatCard, PaymentsBarChart],
  templateUrl: './reportes-page.html',
  styleUrl: './reportes-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportesPage {
  protected readonly periodTypes: readonly { value: ReportPeriodType; label: string }[] = [
    { value: 'month', label: 'Mes' },
    { value: 'year', label: 'Año' },
    { value: 'custom', label: 'Rango personalizado' },
  ];
  protected readonly selectedPeriodType = signal<ReportPeriodType>('month');
  protected readonly selectedMonth = signal(new Date(DEFAULT_MONTH));
  protected readonly selectedYear = signal(DEFAULT_YEAR);
  protected readonly customStartDate = signal(DEFAULT_FROM);
  protected readonly customEndDate = signal(DEFAULT_TO);
  protected readonly validationError = signal('');
  protected readonly applied = signal<ReporteAplicado>(this.defaultApplied());

  protected readonly monthLabel = computed(() =>
    new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(
      this.selectedMonth(),
    ),
  );

  protected readonly summaryTitle = computed(() => {
    switch (this.applied().tipo) {
      case 'year':
        return 'Resumen del año';
      case 'custom':
        return 'Resumen del periodo';
      default:
        return 'Resumen del mes';
    }
  });

  protected readonly currentSummary = computed<ResumenReporte>(() => {
    const applied = this.applied();
    if (applied.tipo === 'month') {
      return applied.mes.getFullYear() === 2026 && applied.mes.getMonth() === 8
        ? REPORTE_MES
        : REPORTE_VACIO;
    }
    if (applied.tipo === 'year') return applied.anio === 2026 ? REPORTE_ANIO : REPORTE_VACIO;
    return applied.desde === DEFAULT_FROM && applied.hasta === DEFAULT_TO
      ? REPORTE_RANGO
      : REPORTE_VACIO;
  });

  protected selectPeriod(type: ReportPeriodType): void {
    this.selectedPeriodType.set(type);
    this.validationError.set('');
  }

  protected moveMonth(offset: number): void {
    const month = this.selectedMonth();
    this.selectedMonth.set(new Date(month.getFullYear(), month.getMonth() + offset, 1));
  }

  protected updateYear(event: Event): void {
    this.selectedYear.set(Number((event.target as HTMLSelectElement).value));
  }

  protected updateStartDate(event: Event): void {
    this.customStartDate.set((event.target as HTMLInputElement).value);
  }

  protected updateEndDate(event: Event): void {
    this.customEndDate.set((event.target as HTMLInputElement).value);
  }

  protected applyFilters(): void {
    const type = this.selectedPeriodType();
    const start = this.customStartDate();
    const end = this.customEndDate();
    if (type === 'custom' && (!start || !end || start > end)) {
      this.validationError.set('La fecha Desde debe ser anterior o igual a la fecha Hasta.');
      return;
    }
    this.validationError.set('');
    this.applied.set({
      tipo: type,
      mes: new Date(this.selectedMonth()),
      anio: this.selectedYear(),
      desde: start,
      hasta: end,
    });
  }

  protected clearFilters(): void {
    this.selectedPeriodType.set('month');
    this.selectedMonth.set(new Date(DEFAULT_MONTH));
    this.selectedYear.set(DEFAULT_YEAR);
    this.customStartDate.set(DEFAULT_FROM);
    this.customEndDate.set(DEFAULT_TO);
    this.validationError.set('');
    this.applied.set(this.defaultApplied());
  }

  private defaultApplied(): ReporteAplicado {
    return {
      tipo: 'month',
      mes: new Date(DEFAULT_MONTH),
      anio: DEFAULT_YEAR,
      desde: DEFAULT_FROM,
      hasta: DEFAULT_TO,
    };
  }
}
