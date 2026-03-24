import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Coordinates, GeolocationService, LocationName } from '../services/geolocation/geolocation-service';
import { HourlyForecastResponse, OpenMeteoService } from '../services/open-meteo/open-meteo-service';
import { WeatherIconService } from '../services/weather-icon/weather-icon-service';
import { map, Subject, takeUntil } from 'rxjs';
import { HourlyForecast } from '../models/hourly-forecast.model';
import { TemperatureDisplayPipe } from '../pipes/temperature-display.pipe';
import { WeatherFacadeService } from '../services/weather-facade/weather-facade.service';

interface DayOption {
  date: string;
  name: string;
}

@Component({
  selector: 'app-hourly-forecast-component',
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    TemperatureDisplayPipe
  ],
  templateUrl: './hourly-forecast-component.html',
  styleUrl: './hourly-forecast-component.less'
})
export class HourlyForecastComponent implements OnInit {
  selectedDay: DayOption;
  days: DayOption[];
  hourlyForecasts: HourlyForecast[] = [];

  destroy$ = new Subject<void>();

  constructor (
    private _weatherFacadeService: WeatherFacadeService,
    private _weatherIconService: WeatherIconService
  ) {
    this.days = this.getDaysOfWeek();
    this.selectedDay = this.days[0];
  }

  ngOnInit() {
    this._weatherFacadeService.hourlyForecasts$
        .pipe(takeUntil(this.destroy$))
        .subscribe(hourlyForecasts => {
            console.log('Received hourly forecasts:', hourlyForecasts);
            this.hourlyForecasts = hourlyForecasts
        });
  }

  public getWeatherIcon(weatherCode: number): string {
      return this._weatherIconService.getMappedWeatherIcon(weatherCode);
  }

  public onDayChange(selectedDay: DayOption): void {
    this.selectedDay = selectedDay;
    this._loadHourlyForecasts(this.selectedDay.date);
  }

  private _loadHourlyForecasts(date: string): void {
    this._weatherFacadeService.getHourlyForecastForDay(date)
        .pipe(takeUntil(this.destroy$))
        .subscribe(hourlyForecasts => {
            this.hourlyForecasts = hourlyForecasts;
        });
  }

  private getDaysOfWeek(): DayOption[] {
    const daysOfWeek: DayOption[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
      const dateString = date.toISOString().split('T')[0];
      daysOfWeek.push({date: dateString, name: dayName});
    }

    daysOfWeek[0].name += " (today)";

    return daysOfWeek;
  }
}