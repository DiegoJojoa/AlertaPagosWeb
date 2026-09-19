import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon, IconName } from '../../shared/components/icon/icon';

interface NavItem {
  readonly label: string;
  readonly path: string;
  readonly icon: IconName;
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Inicio', path: '/inicio', icon: 'home' },
  { label: 'Facturas', path: '/facturas', icon: 'file-text' },
  { label: 'Reportes', path: '/reportes', icon: 'pie-chart' },
  { label: 'Configuración', path: '/configuracion', icon: 'settings' },
];

@Component({
  selector: 'app-sidebar-nav',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './sidebar-nav.html',
  styleUrl: './sidebar-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarNav {
  readonly isOpen = input(false);
  readonly closeRequested = output<void>();

  protected readonly navItems = NAV_ITEMS;

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.isOpen()) {
      this.closeRequested.emit();
    }
  }
}
