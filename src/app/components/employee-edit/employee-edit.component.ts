import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../services/employee.service';

// Custom validator for numbers only
function numbersOnlyValidator(control: { value: any; }): { [key: string]: any } | null {
  const NUMBERS_PATTERN = /^\d+(\.\d{1,2})?$/;
  return NUMBERS_PATTERN.test(control.value) ? null : { 'numbersOnly': true };
}

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss'],
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
export class EmployeeEditComponent implements OnInit {
  employeeForm!: FormGroup;
  loading = true;
  submitting = false;
  submitted = false;
  error = '';
  employeeId = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
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

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeId = id;
      this.loadEmployee(id);
    } else {
      this.error = 'Employee ID not found';
      this.loading = false;
    }
  }

  // Getter for easy access to form fields
  get f() { return this.employeeForm.controls; }

  loadEmployee(id: string): void {
    this.employeeService.getEmployee(id)
      .subscribe({
        next: (data) => {
          // Map API response field names to form field names
          this.employeeForm.patchValue({
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            gender: data.gender,
            designation: data.designation,
            salary: data.salary,
            department: data.department,
            date_of_joining: data.date_of_joining
          });
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load employee data';
          this.loading = false;
          this.snackBar.open(this.error, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.employeeForm.invalid) {
      return;
    }

    this.submitting = true;
    // Prepare data for API with correct field names
    const employeeData = {
      first_name: this.employeeForm.value.firstName,
      last_name: this.employeeForm.value.lastName,
      email: this.employeeForm.value.email,
      gender: this.employeeForm.value.gender,
      designation: this.employeeForm.value.designation,
      salary: parseFloat(this.employeeForm.value.salary),
      department: this.employeeForm.value.department,
      date_of_joining: this.employeeForm.value.date_of_joining
    };

    this.employeeService.updateEmployee(this.employeeId, employeeData)
      .subscribe({
        next: () => {
          this.snackBar.open('Employee updated successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/employees']);
        },
        error: (error) => {
          this.snackBar.open('Failed to update employee: ' + (error.message || 'Unknown error'), 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.submitting = false;
        }
      });
  }

  cancelEdit(): void {
    this.router.navigate(['/employees', this.employeeId]);
  }
}
