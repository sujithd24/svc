import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    CommonModule,
    MatToolbarModule
  ]
})
export class HeaderComponent {

  constructor(private router: Router) { }

  back(){
    this.router.navigate(['/dashboard']);
  }
}
