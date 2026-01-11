import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DailyForecastResponse {
  daily: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    weather_code: number[]
  }
}

export interface HourlyForecastResponse {
    hourly: {
        temperature_2m: number[];
        time: string[];
        weather_code: number[];
    }
}

@Injectable({
  providedIn: 'root',
})
export class OpenMeteoService {
  private apiUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private httpClient: HttpClient) {}

  getCurrentWeather(latitude: number, longitude: number): Observable<any> {
    let params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('temperature_unit', 'celsius')
      .set('timezone', 'auto')
      .set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code')
    
    return this.httpClient.get(this.apiUrl, { params });
  }

  getDailyForecast(latitude: number, longitude: number): Observable<DailyForecastResponse> {
    let params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('temperature_unit', 'celsius')
      .set('timezone', 'auto')
      .set('daily', 'weather_code,temperature_2m_max,temperature_2m_min')
    
    return this.httpClient.get<DailyForecastResponse>(this.apiUrl, { params });
  }

  getHourlyForecast(latitude: number, longitude: number, startDate?: string): Observable<HourlyForecastResponse> {
    let params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('temperature_unit', 'celsius')
      .set('timezone', 'auto')
      .set('hourly', 'weather_code,temperature_2m');
    if (startDate) {
      params = params
        .set('start_date', startDate)
        .set('end_date', this._getNextDate(startDate));
    } else {
      params = params.set('forecast_hours', '12');
    }

    return this.httpClient.get<HourlyForecastResponse>(this.apiUrl, { params });
  }

  private _getNextDate(date: string): string {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + 1);

    return currentDate.toISOString().split('T')[0];
  }
}
