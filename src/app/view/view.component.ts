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
    this.http.get<{ file: { date?: string[]; sales?: number[]; forecasted_sales?: number[] }; error?: any }>(`${environment.apiUrl}/get_file`).subscribe(response=>{
      this.results = response;
      this.labels = response.file?.date ?? [];
      this.sales = response.file?.sales ?? [];
      this.forecast = response.file?.forecasted_sales ?? [];
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
