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
import { map } from 'rxjs';

interface HourlyForecast {
  temperature: number;
  weatherCode: number;
  time: string;
}

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
    FormsModule
  ],
  templateUrl: './hourly-forecast-component.html',
  styleUrl: './hourly-forecast-component.less'
})
export class HourlyForecastComponent implements OnInit {
  selectedDay: DayOption;
  days: DayOption[];
  hourlyForecasts: HourlyForecast[] = [];
  coords: Coordinates | null = null;

  constructor(
      private _locationService: GeolocationService,
      private _openMeteoService: OpenMeteoService,
      private _weatherIconService: WeatherIconService
  ) {
    this.days = this.getDaysOfWeek();
    this.selectedDay = this.days[0];
  }

  ngOnInit() {
    this._locationService.getCurrentLocation().subscribe(
        ([coords, locationName]: [Coordinates, LocationName]) => {
            this.coords = coords;
            this._loadHourlyForecasts();
        }
    );
  }

  public getWeatherIcon(weatherCode: number): string {
      return this._weatherIconService.getMappedWeatherIcon(weatherCode);
  }

  public onDayChange(selectedDay: DayOption): void {
    this.selectedDay = selectedDay;
    this._loadHourlyForecasts(this.selectedDay.date);
  }

  private _loadHourlyForecasts(date?: string): void {
    if (!this.coords) {
        return;
    }
    this._openMeteoService
      .getHourlyForecast(this.coords.latitude, this.coords.longitude, date)
      .pipe(
          map((weatherResponse: HourlyForecastResponse) =>
              weatherResponse.hourly.time.map((_, i) => ({
                temperature: Math.round(weatherResponse.hourly.temperature_2m[i]),
                weatherCode: weatherResponse.hourly.weather_code[i],
                time: this.parseTime(weatherResponse.hourly.time[i])
              })
          )
        )
      )
      .subscribe((hourlyForecasts) => {
          this.hourlyForecasts = hourlyForecasts;
      });
  }

  private parseTime(time: string): string {
    const date = new Date(time);
    const hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    return `${formattedHours} ${ampm}`;
  }

  private getCurrentDay(): DayOption {
    const today = new Date();
    console.log({date: today.toISOString().split('T')[0], name: `${new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today)} (today)`})
    return {date: today.toISOString().split('T')[0], name: `${new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today)} (today)`};
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