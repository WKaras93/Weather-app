import { DailyForecast } from "./daily-forecast.model";
import { CurrentWeatherData } from "./current-weather.model";
import { Coordinates, LocationName } from "../services/geolocation/geolocation-service";
import { UnitSystem } from "../services/unit/unit-service";
import { HourlyForecast } from "./hourly-forecast.model";

export interface WeatherViewModel {
    location: [Coordinates, LocationName] | null;
    unitSystem: UnitSystem;
    isLoading: boolean;
    error: string | null;
    currentWeather: CurrentWeatherData | null;
    dailyForecasts: DailyForecast[];
    hourlyForecasts: HourlyForecast[];
}
