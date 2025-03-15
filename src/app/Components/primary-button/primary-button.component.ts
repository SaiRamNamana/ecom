import { CommonModule, NgIf } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-primary-button',
  imports: [NgIf,FontAwesomeModule,CommonModule],
  templateUrl: './primary-button.component.html',
  styleUrl: './primary-button.component.css'
})
export class PrimaryButtonComponent {
  @Input() label: string = ''
  btnClicked = output();
  @Input() disabled: boolean = false;
  @Input() badgeCount?: number;
  @Input() icon?: IconDefinition;
}
