import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class SearchComponent implements OnInit {
  searchForm = new FormGroup({
    term: new FormControl(''),
    department: new FormControl(''),
    designation: new FormControl('')
  });
  
  @Output() search = new EventEmitter<string>();
  @Output() advancedSearch = new EventEmitter<{department?: string, designation?: string}>();

  // List of departments for dropdown
  departments = [
    'Engineering', 
    'HR', 
    'Sales', 
    'Marketing', 
    'Finance', 
    'Product'
  ];

  // List of designations for dropdown
  designations = [
    'Manager',
    'Developer',
    'Designer',
    'Director',
    'Administrator',
    'Analyst',
    'Specialist'
  ];

  constructor() { }

  ngOnInit(): void {
    // For basic search by term
    this.searchForm.get('term')?.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(value => {
      // Emit search value to parent
      this.search.emit(value || '');
    });
  }

  // Trigger advanced search
  onAdvancedSearch(): void {
    const department = this.searchForm.get('department')?.value || '';
    const designation = this.searchForm.get('designation')?.value || '';
    
    if (department || designation) {
      this.advancedSearch.emit({ 
        department: department,
        designation: designation 
      });
    }
  }

  // Reset all filters
  resetFilters(): void {
    this.searchForm.reset();
    this.search.emit('');
    this.advancedSearch.emit({});
  }
}
