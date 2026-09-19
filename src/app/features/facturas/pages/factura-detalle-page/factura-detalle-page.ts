import { toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-factura-detalle-page',
  templateUrl: './factura-detalle-page.html',
  styleUrl: './factura-detalle-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaDetallePage {
  private readonly route = inject(ActivatedRoute);

  private readonly id = toSignal(this.route.paramMap.pipe(map((params) => params.get('id'))), {
    initialValue: null,
  });

  protected readonly subtitulo = computed(() =>
    this.id()
      ? `El detalle de la factura "${this.id()}" estará disponible próximamente.`
      : 'Esta sección estará disponible próximamente.',
  );
}
