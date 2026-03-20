import { Component, OnInit } from '@angular/core';
import { OpenMeteoService, DailyForecastResponse } from '../services/open-meteo/open-meteo-service';
import { Coordinates, GeolocationService, LocationName } from '../services/geolocation/geolocation-service';
import { WeatherIconService } from '../services/weather-icon/weather-icon-service';
import { map } from 'rxjs';
import { DailyForecast } from '../models/daily-forecast.model';

@Component({
  selector: 'app-daily-forecast-component',
  imports: [],
  templateUrl: './daily-forecast-component.html',
  styleUrl: './daily-forecast-component.less'
})
export class DailyForecastComponent implements OnInit {
    dailyForecasts: DailyForecast[] = [];

    constructor(
        private _locationService: GeolocationService,
        private _openMeteoService: OpenMeteoService,
        private _weatherIconService: WeatherIconService
    ) {}

    ngOnInit() {
        this._locationService.getCurrentLocation().subscribe(
            ([coords, locationName]: [Coordinates, LocationName]) => {
                this._openMeteoService
                    .getDailyForecast(coords.latitude, coords.longitude)
                    .pipe(
                        map((weatherResponse: DailyForecastResponse) =>
                            weatherResponse.daily.time.map((_, i) => ({
                                date: weatherResponse.daily.time[i],
                                minTemperature: Math.round(weatherResponse.daily.temperature_2m_min[i]),
                                maxTemperature: Math.round(weatherResponse.daily.temperature_2m_max[i]),
                                forecastCode: weatherResponse.daily.weather_code[i],
                                day: this.getDay(weatherResponse.daily.time[i])
                            }))
                        )
                    )
                .subscribe((dailyForecasts) => {
                    this.dailyForecasts = dailyForecasts
                })
            }
        );
    }

    public getWeatherIcon(weatherCode: number): string {
        return this._weatherIconService.getMappedWeatherIcon(weatherCode);
    }

    private getDay(date: string): string {
        const _date = new Date(date);
        return (new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(_date));
    }
}
