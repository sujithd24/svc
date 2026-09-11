import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../shared/header/header.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule,
    HeaderComponent,
    MatInputModule,
    MatButtonModule
  ]
})
export class DashboardComponent implements OnInit {

  getform!: FormGroup;
  res_status = false;
  isLoading = false;
  loadingMessage = '';
  url1 = `${environment.apiUrl}/upload_file`;
  url2 = `${environment.apiUrl}/post_input`;
  file: any;
  fileName = '';

  constructor(private http: HttpClient, private router: Router, private _snackBar: MatSnackBar) { }

  getFile(event: any) {
    this.file = event.target.files[0];
    this.fileName = this.file ? this.file.name : '';
  }

  useSampleData() {
    this.http.get('/sample-data.csv', { responseType: 'blob' }).subscribe(blob => {
      this.file = new File([blob], 'sample-data.csv', { type: 'text/csv' });
      this.fileName = this.file.name;
    });
  }

  ngOnInit(): void {
    this.getform = new FormGroup({
      'future': new FormControl('', [Validators.required]),
    })
  }

  onSubmit(): void {
    if (!this.file) {
      this._snackBar.open('Choose a CSV file or use the sample data first.', 'Dismiss', { duration: 4000 });
      return;
    }

    this.res_status = false;
    this.isLoading = true;
    this.loadingMessage = 'Uploading data…';

    const monthsdict = { "n": this.getform.value.future };
    const formData = new FormData();
    formData.set("file", this.file);

    this.http.post(this.url1, formData).pipe(
      switchMap(() => {
        this.loadingMessage = 'Saving forecast settings…';
        return this.http.post(this.url2, monthsdict);
      }),
      switchMap(() => {
        this.loadingMessage = 'Generating forecast… this can take a little while.';
        return this.http.get(`${environment.apiUrl}/prediction`);
      })
    ).subscribe({
      next: (resp) => {
        this.isLoading = false;
        this.res_status = resp != null;
      },
      error: (err) => {
        this.isLoading = false;
        this._snackBar.open('Forecast failed. Please try again.', 'Dismiss', { duration: 5000 });
        console.error(err);
      }
    });
  }

  get future() {
    return this.getform.get('future')
  }

  forecast() {
    if (this.res_status) {
      this.router.navigate(['/view']);
    }
  }
}
