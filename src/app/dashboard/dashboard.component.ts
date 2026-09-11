import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
import {  interval } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ThemePalette} from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../shared/header/header.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../environments/environment';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [ 
    CommonModule, 
    MatProgressBarModule,
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
  res_status!:boolean;
  url1=`${environment.apiUrl}/upload_file`;
  url2=`${environment.apiUrl}/post_input`;
  file!:any;
  monthsdict:any;
  out:any;
  
  progressbarValue = 100;
  curSec: number = 0;

  color : ThemePalette = 'warn';

  constructor(private http: HttpClient ,private router: Router , private _snackBar: MatSnackBar) { }

  fileName: string = '';

  getFile(event:any){
    this.file=event.target.files[0];
    this.fileName = this.file ? this.file.name : '';
  }

  useSampleData(){
    this.http.get('/sample-data.csv', { responseType: 'blob' }).subscribe(blob => {
      this.file = new File([blob], 'sample-data.csv', { type: 'text/csv' });
      this.fileName = this.file.name;
    });
  }

  ngOnInit(): void {
    /*this._snackBar.open('Welcome!!', this.logindata.exform.value.name, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000
    });*/
    
    this.res_status=false;
    this.getform=new FormGroup({
      'future':new FormControl('',[Validators.required]),
    })
  }
  onSubmit():void{

   this.monthsdict={ "n":this.getform.value.future}
   let formData=new FormData();
   formData.set("file",this.file);
   
   this.http.post(this.url1,formData).subscribe((resp)=>{ console.log(resp) })
   this.http.post(this.url2,this.monthsdict).subscribe((resp2)=>{ console.log(resp2) })
   this.http.get(`${environment.apiUrl}/prediction`).subscribe(resp=>{
      console.log(resp)
      if(resp!=null){
        this.res_status=true;
      }
    })
  }
  get future(){
    return this.getform.get('future')
  }
  forecast(){
    if(this.res_status){
      this.router.navigate(['/view']);
    }
    
  }
  startTimer() {
    const time = 15;
    const timer$ = interval(1000);

    const sub = timer$.subscribe((sec) => {
      this.progressbarValue = 100 - sec * 100 / time;
      this.curSec = sec;

      if (this.curSec === time) {
        sub.unsubscribe();
      }
    });
  }
}
 