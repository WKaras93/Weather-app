import { Component, OnInit } from '@angular/core';

import { HourlyForecastComponent } from '../hourly-forecast-component/hourly-forecast-component';
import { DailyForecastComponent } from '../daily-forecast-component/daily-forecast-component';
import { Coordinates, GeolocationService, LocationName } from '../services/geolocation/geolocation-service';
import { CommonModule } from '@angular/common';

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
    locationName: LocationName;
    isLoading: boolean;
    today: Date;

    constructor(private _locationService: GeolocationService) {
        this.isLoading = true;
        this.today = new Date();
    }

    ngOnInit(): void {
        this._locationService.getCurrentLocation().subscribe((location: [Coordinates, LocationName]) => {
            this.locationName = location[1];
            this.isLoading = false;
        });
    }
}
