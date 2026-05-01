import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HourlyForecastComponent } from '../hourly-forecast-component/hourly-forecast-component';
import { DailyForecastComponent } from '../daily-forecast-component/daily-forecast-component';
import { LocationName } from '../services/geolocation/geolocation-service';
import { WeatherIconService } from '../services/weather-icon/weather-icon-service';
import { TemperatureDisplayPipe } from '../pipes/temperature-display.pipe';
import { WindSpeedDisplayPipe } from '../pipes/wind-speed-display.pipe';
import { CurrentWeatherData } from '../models/current-weather.model';
import { WeatherFacadeService } from '../services/weather-facade/weather-facade.service';
import { Subject, takeUntil } from 'rxjs';
import { PrecipitationDisplayPipe } from '../pipes/precipitation-display.pipe';

@Component({
    selector: 'app-forecast-component',
    imports: [
        CommonModule,
        DailyForecastComponent,
        HourlyForecastComponent,
        TemperatureDisplayPipe,
        WindSpeedDisplayPipe,
        PrecipitationDisplayPipe
    ],
    templateUrl: './forecast-component.html',
    styleUrl: './forecast-component.less'
})
export class ForecastComponent implements OnInit, OnDestroy {
    locationName!: LocationName;
    isLoading: boolean;
    today: Date;
    currentWeatherData!: CurrentWeatherData;
    unitSystem!: string;

    private destroy$ = new Subject<void>();

    constructor(
        private _weatherFacadeService: WeatherFacadeService,
        private _weatherIconService: WeatherIconService,
    ) {
        this.isLoading = true;
        this.today = new Date();
    }

    ngOnInit(): void {
        this._weatherFacadeService.loadWeatherData();

        this._weatherFacadeService.location$
            .pipe(takeUntil(this.destroy$))
            .subscribe(location => this.locationName = location![1]);
    
        this._weatherFacadeService.currentWeather$
            .pipe(takeUntil(this.destroy$))
            .subscribe(currentWeather => this.currentWeatherData = currentWeather!);

        this._weatherFacadeService.unitSystem$
            .pipe(takeUntil(this.destroy$))
            .subscribe(unitSystem => this.unitSystem = unitSystem);
        
        this._weatherFacadeService.isLoading$
            .pipe(takeUntil(this.destroy$))
            .subscribe(isLoading => this.isLoading = isLoading);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public getWeatherIcon(weatherCode: number): string {
        return this._weatherIconService.getMappedWeatherIcon(weatherCode);
    }
}
