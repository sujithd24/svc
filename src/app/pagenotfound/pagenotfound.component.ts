import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar'
@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.css'],
  standalone: true, 
  imports: [MatToolbarModule]
})
export class PagenotfoundComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  Back(){
    this.router.navigate(['']);
  }

}
