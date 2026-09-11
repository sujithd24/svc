import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.css'],
  imports: [HeaderComponent]
})
export class PagenotfoundComponent {

  constructor(private router: Router) { }

  Back(){
    this.router.navigate(['']);
  }

}
