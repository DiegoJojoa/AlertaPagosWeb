import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type FiltroFacturas = 'pendientes' | 'proximas';

@Component({
  selector: 'app-invoice-filter-tabs',
  templateUrl: './invoice-filter-tabs.html',
  styleUrl: './invoice-filter-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceFilterTabs {
  readonly selectedFilter = input.required<FiltroFacturas>();
  readonly filterChanged = output<FiltroFacturas>();
}
