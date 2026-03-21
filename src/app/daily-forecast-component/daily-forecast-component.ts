import { Component, OnInit } from '@angular/core';
import { WeatherIconService } from '../services/weather-icon/weather-icon-service';
import { Subject, takeUntil } from 'rxjs';
import { DailyForecast } from '../models/daily-forecast.model';
import { WeatherFacadeService } from '../services/weather-facade/weather-facade.service';
import { TemperatureDisplayPipe } from '../pipes/temperature-display.pipe';

@Component({
  selector: 'app-daily-forecast-component',
  imports: [ TemperatureDisplayPipe ],
  templateUrl: './daily-forecast-component.html',
  styleUrl: './daily-forecast-component.less'
})
export class DailyForecastComponent implements OnInit {
    dailyForecasts: DailyForecast[] = [];

    private destroy$ = new Subject<void>();

    constructor(
        private _weatherIconService: WeatherIconService,
        private _weatherFacadeService: WeatherFacadeService
    ) {}

    ngOnInit() {
        this._weatherFacadeService.dailyForecasts$
            .pipe(takeUntil(this.destroy$))
            .subscribe(dailyForecastResponse => this.dailyForecasts = dailyForecastResponse!);
    }

    public getWeatherIcon(weatherCode: number): string {
        return this._weatherIconService.getMappedWeatherIcon(weatherCode);
    }
}
