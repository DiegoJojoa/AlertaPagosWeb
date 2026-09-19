import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName = 'home' | 'file-text' | 'pie-chart' | 'settings' | 'menu' | 'close' | 'user';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(20);
}
