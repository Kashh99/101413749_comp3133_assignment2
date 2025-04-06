import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EmployeeService } from '../../services/employee.service';

// Custom validator for numbers only
function numbersOnlyValidator(control: { value: any; }): { [key: string]: any } | null {
  const NUMBERS_PATTERN = /^\d+(\.\d{1,2})?$/;
  return NUMBERS_PATTERN.test(control.value) ? null : { 'numbersOnly': true };
}

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class EmployeeAddComponent implements OnInit {
  employeeForm!: FormGroup;
  loading = false;
  submitted = false;
  photoBase64: string = '';
  maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: ['', [
        Validators.required, 
        Validators.min(0), 
        Validators.pattern(/^[0-9]*(\.[0-9]{0,2})?$/),
        numbersOnlyValidator
      ]],
      department: ['', Validators.required],
      date_of_joining: ['', Validators.required]
    });
  }

  // Getter for easy access to form fields
  get f() { return this.employeeForm.controls; }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    
    if (file) {
      // Check file size
      if (file.size > this.maxFileSize) {
        this.snackBar.open(`File is too large. Maximum size is 5MB.`, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return;
      }
      
      // Check file type
      if (!file.type.match('image/(jpeg|jpg|png|gif)')) {
        this.snackBar.open(`Only image files (JPG, PNG, GIF) are allowed.`, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        this.photoBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  
  removePhoto(): void {
    this.photoBase64 = '';
  }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.employeeForm.invalid) {
      this.scrollToFirstError();
      return;
    }

    this.loading = true;
    // Convert salary to number and format object for API
    const employeeData = {
      ...this.employeeForm.value,
      first_name: this.employeeForm.value.firstName,
      last_name: this.employeeForm.value.lastName,
      salary: parseFloat(this.employeeForm.value.salary),
      employee_photo: this.photoBase64
    };

    this.employeeService.addEmployee(employeeData)
      .subscribe({
        next: () => {
          this.snackBar.open('Employee added successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/employees']);
        },
        error: (error) => {
          this.snackBar.open('Failed to add employee: ' + (error.message || 'Unknown error'), 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.loading = false;
        }
      });
  }
  
  // Helper method to scroll to the first error
  private scrollToFirstError(): void {
    const firstErrorElement = document.querySelector('.mat-form-field-invalid');
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  cancelAdd(): void {
    this.router.navigate(['/employees']);
  }
}
