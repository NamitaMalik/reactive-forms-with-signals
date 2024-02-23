import { Component, Signal, computed, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import 'zone.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  template: `
    <form [formGroup]="userForm" (ngSubmit)="saveChanges()">
      <label for="firstName">First Name:</label>
      <input formControlName="firstName" id="firstName" />

      <label for="lastName">Last Name:</label>
      <input formControlName="lastName" id="lastName" />

      <label for="country">Country:</label>
      <select formControlName="country" id="country">
        <!-- Add your country options here -->
        <option value="country1">Country 1</option>
        <option value="country2">Country 2</option>
      </select>

      <label for="phoneNumber">Phone Number:</label>
      <input formControlName="phoneNumber" id="phoneNumber" />

      <button type="submit" [disabled]="!hasChanged()">Save Changes</button>
    </form>
  `,
})
export class App {
  userForm!: FormGroup;
  private initialFormValue: any;
  private userFormValues!: Signal<any>;
  hasChanged!: Signal<any>;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      firstName: ['John'],
      lastName: ['Doe'],
      country: ['country1'],
      phoneNumber: ['123-456-7890'],
    });

    // Save the initial form value
    this.initialFormValue = { ...this.userForm.value };

    // Subscribe to form value changes for dynamic functionality
    this.userFormValues = toSignal(this.userForm.valueChanges);

    // Computed value hasChanged, declared an effect, which callback will execute every time userFormValues are changed
    this.hasChanged = computed(() => this.hasFormChanged(this.userFormValues));
  }

  hasFormChanged(val: any) {
    const formValue = val();
    return formValue
      ? JSON.stringify(formValue) !== JSON.stringify(this.initialFormValue)
      : false;
  }

  saveChanges() {
    // Handle save functionality here
    console.log('Changes saved!');
    // Reset form state after saving changes
    this.userForm.markAsPristine();
  }
}

bootstrapApplication(App);
