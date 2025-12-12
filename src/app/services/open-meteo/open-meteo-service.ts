import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
      .set('current_weather', 'true')
      .set('temperature_unit', 'celsius')
      .set('timezone', 'auto');
    
    return this.httpClient.get(this.apiUrl, { params });
  }
}
