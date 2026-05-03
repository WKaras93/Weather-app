import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';
import { Mocked, vi } from 'vitest';

import { ForecastComponent } from './forecast-component';
import { WeatherIconService } from '../services/weather-icon/weather-icon-service';
import { Coordinates, LocationName } from '../services/geolocation/geolocation-service';
import { CurrentWeatherData } from '../models/current-weather.model';
import { WeatherFacadeService } from '../services/weather-facade/weather-facade.service';

const mockLocation: [Coordinates, LocationName] = [
  { latitude: 52.2297, longitude: 21.0122 },
  { city: 'Warsaw', country: 'Poland' }
];

const mockCurrentWeather: CurrentWeatherData = {
  apparentTemperature: 15,
  humidity: 80,
  precipitation: 0,
  temperature: 12,
  windSpeed: 5,
  weatherCode: 1
}

const weatherFacadeStub = {
  loadWeatherData: vi.fn(),
  location$: of(mockLocation),
  currentWeather$: of(mockCurrentWeather),
  unitSystem$: of('metric'),
  isLoading$: of(false),
  dailyForecasts$: of([]),
  hourlyForecasts$: of([]),
}

const weatherIconStub: Mocked<WeatherIconService> = {
  getMappedWeatherIcon: vi.fn(),
  getAltText: vi.fn(),
};

describe('ForecastComponent', () => {
  let component: ForecastComponent;
  let fixture: ComponentFixture<ForecastComponent>;

  beforeEach(async () => {
    weatherFacadeStub.loadWeatherData.mockReset();
    weatherFacadeStub.location$ = of(mockLocation);
    weatherFacadeStub.isLoading$ = of(false);
    weatherIconStub.getMappedWeatherIcon.mockReset();

    await TestBed.configureTestingModule({
      imports: [ForecastComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: WeatherFacadeService, useValue: weatherFacadeStub },
        { provide: WeatherIconService, useValue: weatherIconStub },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
