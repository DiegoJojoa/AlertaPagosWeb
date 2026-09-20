import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { Icon } from '../../../../shared/components/icon/icon';
import { MontoPipe } from '../../../../shared/pipes/monto.pipe';
import { PosponerDialog } from '../../components/posponer-dialog/posponer-dialog';
import { EstadoFactura, Factura } from '../../models/factura.model';
import { ETIQUETAS_POSPONER, OpcionPosponer } from '../../models/opcion-posponer.model';
import { FacturaAccionesService } from '../../services/factura-acciones.service';
import { FacturaService } from '../../services/factura.service';

type EstadoCarga =
  | { readonly tipo: 'cargando' }
  | { readonly tipo: 'error' }
  | { readonly tipo: 'no-encontrada' }
  | { readonly tipo: 'contenido'; readonly factura: Factura };

const ESTADO_LABELS: Record<EstadoFactura, string> = {
  pendiente: 'Pendiente',
  pagada: 'Pagada',
  vencida: 'Vencida',
  anulada: 'Anulada',
};

const ESTADOS_CON_OPCIONES: readonly EstadoFactura[] = ['pendiente', 'vencida'];

@Component({
  selector: 'app-factura-detalle-page',
  imports: [RouterLink, DatePipe, MontoPipe, Icon, ConfirmDialog, PosponerDialog],
  templateUrl: './factura-detalle-page.html',
  styleUrl: './factura-detalle-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaDetallePage {
  private readonly route = inject(ActivatedRoute);
  private readonly facturaService = inject(FacturaService);
  private readonly facturaAccionesService = inject(FacturaAccionesService);
  private readonly toastService = inject(ToastService);
  private readonly montoPipe = new MontoPipe();

  private idActual = '';

  protected readonly estado = signal<EstadoCarga>({ tipo: 'cargando' });

  protected readonly factura = computed(() => {
    const actual = this.estado();
    return actual.tipo === 'contenido' ? actual.factura : null;
  });

  protected readonly estadoLabel = computed(() => {
    const factura = this.factura();
    return factura ? ESTADO_LABELS[factura.estado] : '';
  });

  protected readonly mostrarOpciones = computed(() => {
    const factura = this.factura();
    return factura !== null && ESTADOS_CON_OPCIONES.includes(factura.estado);
  });

  protected readonly descripcionPago = computed(() => {
    const factura = this.factura();
    if (!factura) {
      return '';
    }
    return `Vas a pagar ${this.montoPipe.transform(factura.monto)} por tu factura de ${factura.servicio} a ${factura.empresa}.`;
  });

  protected readonly descripcionAnular = computed(() => {
    const factura = this.factura();
    if (!factura) {
      return '';
    }
    return `Esta acción no se puede deshacer. La factura ${factura.numero} de ${factura.servicio} será anulada permanentemente.`;
  });

  protected readonly mostrarModalPagar = signal(false);
  protected readonly pagando = signal(false);
  protected readonly errorPagar = signal<string | null>(null);

  protected readonly mostrarModalPosponer = signal(false);
  protected readonly posponiendo = signal(false);
  protected readonly errorPosponer = signal<string | null>(null);

  protected readonly mostrarModalAnular = signal(false);
  protected readonly anulando = signal(false);
  protected readonly errorAnular = signal<string | null>(null);

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id') ?? ''),
        takeUntilDestroyed(),
      )
      .subscribe((id) => this.cargar(id));
  }

  protected reintentar(): void {
    this.cargar(this.idActual);
  }

  protected abrirModalPagar(): void {
    this.errorPagar.set(null);
    this.mostrarModalPagar.set(true);
  }

  protected cerrarModalPagar(): void {
    if (this.pagando()) {
      return;
    }
    this.mostrarModalPagar.set(false);
    this.errorPagar.set(null);
  }

  protected confirmarPago(): void {
    const factura = this.factura();
    if (!factura || this.pagando()) {
      return;
    }

    this.pagando.set(true);
    this.errorPagar.set(null);

    this.facturaAccionesService.marcarComoPagada(factura.id).subscribe({
      next: () => {
        this.pagando.set(false);
        this.mostrarModalPagar.set(false);
        this.actualizarFactura((f) => ({
          ...f,
          estado: 'pagada',
          historial: [...f.historial, { fecha: new Date(), descripcion: 'Pago registrado' }],
        }));
        this.toastService.success('Factura marcada como pagada correctamente');
      },
      error: () => {
        this.pagando.set(false);
        this.errorPagar.set('No se pudo registrar el pago. Intenta de nuevo.');
      },
    });
  }

  protected abrirModalPosponer(): void {
    this.errorPosponer.set(null);
    this.mostrarModalPosponer.set(true);
  }

  protected cerrarModalPosponer(): void {
    if (this.posponiendo()) {
      return;
    }
    this.mostrarModalPosponer.set(false);
    this.errorPosponer.set(null);
  }

  protected confirmarPosponer(opcion: OpcionPosponer): void {
    const factura = this.factura();
    if (!factura || this.posponiendo()) {
      return;
    }

    this.posponiendo.set(true);
    this.errorPosponer.set(null);

    this.facturaAccionesService.posponerRecordatorio(factura.id, opcion).subscribe({
      next: () => {
        this.posponiendo.set(false);
        this.mostrarModalPosponer.set(false);
        this.actualizarFactura((f) => ({
          ...f,
          historial: [
            ...f.historial,
            {
              fecha: new Date(),
              descripcion: `Recordatorio pospuesto: ${ETIQUETAS_POSPONER[opcion]}`,
            },
          ],
        }));
        this.toastService.warning('Recordatorio pospuesto correctamente');
      },
      error: () => {
        this.posponiendo.set(false);
        this.errorPosponer.set('No se pudo posponer el recordatorio. Intenta de nuevo.');
      },
    });
  }

  protected abrirModalAnular(): void {
    this.errorAnular.set(null);
    this.mostrarModalAnular.set(true);
  }

  protected cerrarModalAnular(): void {
    if (this.anulando()) {
      return;
    }
    this.mostrarModalAnular.set(false);
    this.errorAnular.set(null);
  }

  protected confirmarAnular(): void {
    const factura = this.factura();
    if (!factura || this.anulando()) {
      return;
    }

    this.anulando.set(true);
    this.errorAnular.set(null);

    this.facturaAccionesService.anularFactura(factura.id).subscribe({
      next: () => {
        this.anulando.set(false);
        this.mostrarModalAnular.set(false);
        this.actualizarFactura((f) => ({
          ...f,
          estado: 'anulada',
          historial: [...f.historial, { fecha: new Date(), descripcion: 'Factura anulada' }],
        }));
        this.toastService.danger('Factura anulada correctamente');
      },
      error: () => {
        this.anulando.set(false);
        this.errorAnular.set('No se pudo anular la factura. Intenta de nuevo.');
      },
    });
  }

  private cargar(id: string): void {
    this.idActual = id;
    this.estado.set({ tipo: 'cargando' });

    this.facturaService.obtenerFactura(id).subscribe({
      next: (factura) => {
        this.estado.set(factura ? { tipo: 'contenido', factura } : { tipo: 'no-encontrada' });
      },
      error: () => {
        this.estado.set({ tipo: 'error' });
      },
    });
  }

  private actualizarFactura(mutador: (factura: Factura) => Factura): void {
    const actual = this.estado();
    if (actual.tipo !== 'contenido') {
      return;
    }
    this.estado.set({ tipo: 'contenido', factura: mutador(actual.factura) });
  }
}
