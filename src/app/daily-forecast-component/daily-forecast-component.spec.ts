import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi, Mocked } from 'vitest';

import { DailyForecastComponent } from './daily-forecast-component';
import { DailyForecast } from '../models/daily-forecast.model';
import { WeatherFacadeService } from '../services/weather-facade/weather-facade.service';
import { WeatherIconService } from '../services/weather-icon/weather-icon-service';
import { provideZonelessChangeDetection } from '@angular/core';

const mockDailyForecasts: DailyForecast[] = [
  { forecastCode: 1, minTemperature: 10, maxTemperature: 20, date: '2026-04-20', day: 'Monday' },
  { forecastCode: 3, minTemperature: 8,  maxTemperature: 17, date: '2026-04-21', day: 'Tuesday' },
];

const weatherFacadeStub: Mocked<Pick<WeatherFacadeService, 'dailyForecasts$'>> = {
  dailyForecasts$: of(mockDailyForecasts),
};

const weatherIconStub: Mocked<WeatherIconService> = {
  getMappedWeatherIcon: vi.fn(),
  getAltText: vi.fn(),
};

describe('DailyForecastComponent', () => {
  let component: DailyForecastComponent;
  let fixture: ComponentFixture<DailyForecastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyForecastComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: WeatherFacadeService, useValue: weatherFacadeStub },
        { provide: WeatherIconService, useValue: weatherIconStub },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DailyForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
