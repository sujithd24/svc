import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { MatCardModule } from '@angular/material/card'
import { environment } from '../../environments/environment';
Chart.register(...registerables)
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  imports: [MatCardModule,CommonModule, HeaderComponent]
})
export class ViewComponent implements OnInit {

  reloadPage() { window.location.reload(); }

  public results:any;
  public labels:any[]=[];
  public sales:any[]=[];
  public forecast:any[]=[];
  public plotUrl = `${environment.apiUrl}/plot_forecast.png`;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object) { }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (!localStorage.getItem('reloaded')){
      localStorage.setItem('reloaded','true')
      window.location.reload();
      } else {
       localStorage.removeItem('reloaded')
      }
    this.http.get(`${environment.apiUrl}/get_file`).subscribe(response=>{
      this.results=response
      console.log(this.results)
      for (var i in this.results['file']["Unnamed: 0"]){
        this.labels.push(this.results['file']["Unnamed: 0"][i])
      }
      for (var i in this.results['file']["sales"]){
        this.sales.push(this.results['file']["sales"][i])
      }
      for (var i in this.results['file']["forecasted sales"]){
        this.forecast.push(this.results['file']["forecasted sales"][i])
      }
      this.labels=this.labels.map(function(e){return e.toString()})
      this.sales=this.sales.map(function(e){return e.toString()})
      this.forecast=this.forecast.map(function(e){return e.toString()})
      console.log(this.labels)
      console.log(this.sales)
      console.log(this.forecast)
      this.RenderChart(this.labels,this.sales,this.forecast);
    })
    
  }

  

  RenderChart(labeldata:any,salesdata:any,forecastdata:any){
   
    
    const chart = new Chart("MyChart", {

      
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: labeldata, 
	       datasets: [
          {
            label: "Sales",
            data: salesdata,
            backgroundColor: 'blue'
          },
          {
            label: "Forecast",
            data: forecastdata,
            backgroundColor: 'limegreen'
          }  
        ]
      },
      options: {
        aspectRatio:2.5
      }
      
    });
  }
  
}
