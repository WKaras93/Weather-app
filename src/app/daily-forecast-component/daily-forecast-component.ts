import { Component, OnInit } from '@angular/core';
import { OpenMeteoService } from '../services/open-meteo/open-meteo-service';

@Component({
  selector: 'app-daily-forecast-component',
  imports: [],
  templateUrl: './daily-forecast-component.html',
  styleUrl: './daily-forecast-component.less'
})
export class DailyForecastComponent implements OnInit {
  days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  constructor(private _openMeteoService: OpenMeteoService) {}

  ngOnInit() {
    const londonLat = 51.5074;
    const londonLon = 0.1278;
    this._openMeteoService.getCurrentWeather(londonLat, londonLon).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log('Error: ', err);
      }
    })
  }
}
