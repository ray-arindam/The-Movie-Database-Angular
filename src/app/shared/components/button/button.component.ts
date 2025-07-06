import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [disabled]="disabled"
      (click)="onClick($event)"
      [ngClass]="{
        'bg-blue-600 hover:bg-blue-700 text-white': !disabled,
        'bg-gray-400 text-gray-200 cursor-not-allowed': disabled,
        'cursor-pointer': !disabled
      }"
      class="px-4 py-2 rounded-lg shadow font-semibold transition focus:outline-none"
      type="button"
    >
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() disabled = false;
  @Output() buttonClick = new EventEmitter<Event>();

  /**
   * Handles the button click event. Emits the buttonClick event if not disabled.
   */
  onClick(event: Event) {
    if (this.disabled) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    this.buttonClick.emit(event);
  }
}
