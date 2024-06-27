import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor, OnInit {
  
  @Input() control: FormControl;
  @Input() type: string;
  @Input() id: string;
  @Input() label: string;
  @Input() placeholder: string;
  @Input() errorMessage: string;
  
  private onChange: any = () => {};
  private onTouched: any = () => {};
  
  constructor() { }
  
  ngOnInit() {
    if (!this.control) {
      throw new Error('FormControl is required');
    }
    
    this.control.valueChanges.subscribe(value => {
      this.onChange(value);
    });
  }
  
  writeValue(value: any): void {
    if (value !== this.control.value) {
      this.control.setValue(value);
    }
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
