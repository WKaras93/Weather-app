import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

export interface CityResult {
    id: number;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
    population?: number;
}

export interface CitySearchResponse {
    results?: CityResult[];
}

@Injectable({
  providedIn: 'root'
})
export class CitiesSearchService {
    private readonly apiUrl = 'https://geocoding-api.open-meteo.com/v1/search';

    constructor(private _httpClient: HttpClient) {}

    getSearchCities(name: string) {
        const params = this.getHttpParams(name);

        return this._httpClient
            .get<CitySearchResponse>(this.apiUrl, { params })
            .pipe(map(res => res.results ?? []))
    }

    private getHttpParams(name: string): HttpParams {
        let params = new HttpParams();

        return params
            .set('name', name)
            .set('count', 10)
            .set('language', 'en')
            .set('format', 'json');
    }
}
