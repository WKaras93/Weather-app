import { Injectable } from "@angular/core";
import { UnitService, UnitSystem } from "../unit/unit-service";
import { HourlyForecastResponse, OpenMeteoService } from "../open-meteo/open-meteo-service";
import { Coordinates, GeolocationService } from "../geolocation/geolocation-service";
import { skip, combineLatest, debounceTime, switchMap, of, Observable, BehaviorSubject, Subscription, forkJoin } from "rxjs";
import { filter, map, min, tap } from "rxjs/operators";
import { WeatherViewModel } from "../../models/weather-view.model";
import { CurrentWeatherData } from "../../models/current-weather.model";
import { HourlyForecast } from "../../models/hourly-forecast.model";
import { DailyForecast } from "../../models/daily-forecast.model";

const INITIAL_STATE: WeatherViewModel = {
    location: null,
    unitSystem: 'metric',
    isLoading: false,
    error: null,
    currentWeather: null,
    dailyForecasts: [],
    hourlyForecasts: []
};

const CACHE_TTL_MS = 30 * 60 * 1000;
const CACHE_STORAGE_KEY = 'weather_cache';

interface CacheEntry {
    data: Omit<WeatherViewModel, 'isLoading' | 'error'>;
    cachedAt: number;
}

interface CacheStore {
    [cacheKey: string]: CacheEntry;
}

@Injectable({ providedIn: 'root' })
export class WeatherFacadeService {
    private stateSubject = new BehaviorSubject<WeatherViewModel>(INITIAL_STATE);
    private subscriptions = new Subscription();

    readonly state$ = this.stateSubject.asObservable();
    readonly location$ = this.state$.pipe(map(state => state.location));
    readonly unitSystem$ = this.state$.pipe(map(state => state.unitSystem));
    readonly isLoading$ = this.state$.pipe(map(state => state.isLoading));
    readonly error$ = this.state$.pipe(map(state => state.error));
    readonly currentWeather$ = this.state$.pipe(map(state => state.currentWeather));
    readonly dailyForecasts$ = this.state$.pipe(map(state => state.dailyForecasts));
    readonly hourlyForecasts$ = this.state$.pipe(map(state => state.hourlyForecasts));

    constructor(
        private _geolocationService: GeolocationService,
        private _openMeteoService: OpenMeteoService,
        private _unitService: UnitService
    ) {
        const unitSyncSub = this._unitService.currentUnitSystem$.subscribe(system => {
            this.patchState({ unitSystem: system });
        });

        const unitChangeSub = this._unitService.currentUnitSystem$.pipe(
            skip(1),
            debounceTime(500),
            switchMap(() => {
                const cached = this.stateSubject.value.location;
                return cached ? of(cached) : of(null);
            }),
            filter(location => location !== null)
        ).subscribe(location => {
            this.fetchAndCacheWeather(location![0], true).subscribe();
    });

    this.subscriptions.add(unitSyncSub);
    this.subscriptions.add(unitChangeSub);
    }

    loadWeatherData() {
        if (this.stateSubject.value.isLoading) return;

        this.patchState({ isLoading: true, error: null });

        const sub = this._geolocationService.getCurrentLocation().pipe(
            tap(location => this.patchState({ location })),
            switchMap(location => {
                const coords = location[0];
                const cacheKey = this.buildCacheKey(coords, this._unitService.currentUnitSystem);
                // const cached = this.readFromStorgage(cacheKey);
                const cached = null;

                if (cached) {
                    this.patchState({ ...cached.data, isLoading: false, error: null });
                    return of(null);
                }

                return this.fetchAndCacheWeather(coords);
            })
        ).subscribe({
            error: (err: string) => this.patchState({ error: err, isLoading: false })
        });
        
        this.subscriptions.add(sub);
    }

    refresh() {
        this.clearStorage();
        this.patchState({ ...INITIAL_STATE, unitSystem: this._unitService.currentUnitSystem });
        this.loadWeatherData();
    }

    getHourlyForecastForDay(date: string) {
        const location = this.stateSubject.value.location;
        if (!location) throw new Error('Location not available');

        return this._openMeteoService
        .getHourlyForecast(location[0].latitude, location[0].longitude, date)
        .pipe(map(response => this.mapHourlyForecast(response)));
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private buildCacheKey(coords: Coordinates, unitSystem: UnitSystem): string {
        const lat = coords.latitude.toFixed(2);
        const lon = coords.longitude.toFixed(2);
        const date = new Date().toISOString().split('T')[0];

        return `${lat}_${lon}_${date}_${unitSystem}`;
    }

    private fetchAndCacheWeather(coords: Coordinates, forceInvalidateStorage = false) {
        const cacheKey = this.buildCacheKey(coords, this._unitService.currentUnitSystem);

        if (forceInvalidateStorage) {
            this.deleteStorageKey(cacheKey);
        }

        this.patchState({ isLoading: true });

        return forkJoin({
            current: this._openMeteoService.getCurrentWeather(coords.latitude, coords.longitude),
            daily: this._openMeteoService.getDailyForecast(coords.latitude, coords.longitude),
            hourly: this._openMeteoService.getHourlyForecast(coords.latitude, coords.longitude)
        }).pipe(
            tap(({ current, daily, hourly }) => {
                const cachable = {
                    location: this.stateSubject.value.location,
                    currentWeather: this.mapCurrentWeather(current),
                    dailyForecasts: this.mapDailyForecasts(daily),
                    hourlyForecasts: this.mapHourlyForecast(hourly),
                    unitSystem: this._unitService.currentUnitSystem
                };

                this.patchState({ ...cachable, isLoading: false, error: null });
                this.writeToStorage(cacheKey, { data: cachable, cachedAt: Date.now() });
            })           
        );
    }

    private readFromStorgage(cacheKey: string): CacheEntry | null {
        try {
            const raw = localStorage.getItem(CACHE_STORAGE_KEY);
            if (!raw) return null;

            const store: CacheStore = JSON.parse(raw);
            const entry = store[cacheKey];

            if (!entry) return null;

            return (Date.now() - entry.cachedAt) < CACHE_TTL_MS ? entry : null;
        } catch {
            return null;
        }
    }

    private writeToStorage(cacheKey: string, entry: CacheEntry) {
        try {
            const raw = localStorage.getItem(CACHE_STORAGE_KEY);
            const store: CacheStore = raw ? JSON.parse(raw) : {};
            store[cacheKey] = entry;
            localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(store));
        } catch {}
    }

    private deleteStorageKey(cacheKey: string) {
        try {
            const raw = localStorage.getItem(CACHE_STORAGE_KEY);
            if (!raw) return;

            const store: CacheStore = JSON.parse(raw);
            delete store[cacheKey];
            localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(store));
        } catch {}
    }

    private clearStorage() {
        localStorage.removeItem(CACHE_STORAGE_KEY);
    }

    private patchState(partial: Partial<WeatherViewModel>) {
        this.stateSubject.next({ ...this.stateSubject.value, ...partial });
    }

    private mapCurrentWeather(response: any): CurrentWeatherData {
        const c = response.current;
        return {
            apparentTemperature: Math.round(c.apparent_temperature),
            humidity: c.relative_humidity_2m,
            precipitation: c.precipitation,
            temperature: Math.round(c.temperature_2m),
            windSpeed: Math.round(c.wind_speed_10m),
            weatherCode: c.weather_code
        };
    }

    private mapDailyForecasts(response: any): DailyForecast[] {
        const { time, temperature_2m_max, temperature_2m_min, weather_code } = response.daily;

        return time.map((date: string, index: number): DailyForecast => ({
            date,
            minTemperature: Math.round(temperature_2m_min[index]),
            maxTemperature: Math.round(temperature_2m_max[index]),
            forecastCode: weather_code[index],
            day: this.getDay(date)
        }));
    }

    private mapHourlyForecast(response: HourlyForecastResponse): HourlyForecast[] {
        const { time, temperature_2m, weather_code } = response.hourly;

        return time.map((time: string, index: number): HourlyForecast => ({
            time,
            temperature: Math.round(temperature_2m[index]),
            weatherCode: weather_code[index]
        }));
    }

    private getDay(date: string): string {
        const _date = new Date(date);
        return (new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(_date));
    }
}