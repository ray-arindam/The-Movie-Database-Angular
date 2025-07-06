import { CommonModule } from '@angular/common';
import { Component, OnInit, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchBarComponent),
      multi: true,
    },
  ],
})
export class SearchBarComponent implements ControlValueAccessor, OnInit {
  @Input() debounceTimeMs = 300; // default debounce time in ms

  searchControl = new FormControl('');
  private subscription!: Subscription;
  isDisabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.subscription = this.searchControl.valueChanges
      .pipe(debounceTime(this.debounceTimeMs), distinctUntilChanged())
      .subscribe((value) => {
        if (value && typeof value === 'string' && value.trim()) {
          console.log('Search value changed:', value);
          this.onChange(value);
        }
      });
  }

  writeValue(value: string): void {
    this.searchControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    isDisabled ? this.searchControl.disable() : this.searchControl.enable();
  }

  onBlur(): void {
    this.onTouched();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
