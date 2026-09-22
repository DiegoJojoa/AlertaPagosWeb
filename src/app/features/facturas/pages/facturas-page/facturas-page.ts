import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-facturas-page',
  templateUrl: './facturas-page.html',
  styleUrl: './facturas-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturasPage {}
