import { Component, OnInit } from '@angular/core';

import { HourlyForecastComponent } from '../hourly-forecast-component/hourly-forecast-component';
import { DailyForecastComponent } from '../daily-forecast-component/daily-forecast-component';
import { Coordinates, GeolocationService, LocationName } from '../services/geolocation/geolocation-service';
import { CommonModule } from '@angular/common';
import { OpenMeteoService } from '../services/open-meteo/open-meteo-service';
import { WeatherIconService } from '../services/weather-icon/weather-icon-service';

export interface CurrentWeatherData {
    apparentTemperature: number;
    humidity: number;
    precipitation: number;
    temperature: number;
    windSpeed: number;
    weatherCode: number;
}

@Component({
    selector: 'app-forecast-component',
    imports: [
        CommonModule,
        DailyForecastComponent,
        HourlyForecastComponent
    ],
    templateUrl: './forecast-component.html',
    styleUrl: './forecast-component.less'
})
export class ForecastComponent implements OnInit {
    locationName!: LocationName;
    isLoading: boolean;
    today: Date;
    currentWeatherData!: CurrentWeatherData;

    constructor(
        private _locationService: GeolocationService,
        private _openMeteoService: OpenMeteoService,
        private _weatherIconService: WeatherIconService
    ) {
        this.isLoading = true;
        this.today = new Date();
    }

    ngOnInit(): void {
        this.updateCurrentWeatherData();
    }

    public getWeatherIcon(weatherCode: number): string {
        return this._weatherIconService.getMappedWeatherIcon(weatherCode);
    }

    private updateCurrentWeatherData() {
        this._locationService.getCurrentLocation().subscribe((location: [Coordinates, LocationName]) => {
            this.locationName = location[1];
            this.isLoading = false;

            this._openMeteoService.getCurrentWeather(location[0].latitude, location[0].longitude).subscribe(weatherResponse => {
                console.log('getCurrentWeather ', weatherResponse)
                const currentWeatherData = weatherResponse.current;

                this.currentWeatherData = {
                    apparentTemperature: Math.round(currentWeatherData.apparent_temperature),
                    humidity: currentWeatherData.relative_humidity_2m,
                    precipitation: currentWeatherData.precipitation,
                    temperature: Math.round(currentWeatherData.temperature_2m),
                    windSpeed: Math.round(currentWeatherData.wind_speed_10m),
                    weatherCode: currentWeatherData.weather_code
                }
            });
        });
    }
}
