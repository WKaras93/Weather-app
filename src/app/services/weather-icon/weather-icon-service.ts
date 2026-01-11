import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WeatherIconService {
    getMappedWeatherIcon(weatherCode: number): string {
        const prefixPath = 'images/';

        const ranges: { max: number; icon: string }[] = [
            { max: 0, icon: 'icon-sunny.webp' },
            { max: 2, icon: 'icon-partly-cloudy.webp' },
            { max: 3, icon: 'icon-overcast.webp' },
            { max: 49, icon: 'icon-fog.webp' },
            { max: 59, icon: 'icon-drizzle.webp' },
            { max: 69, icon: 'icon-rain.webp' },
            { max: 79, icon: 'icon-snow.webp' },
            { max: 89, icon: 'icon-rain.webp' },
            { max: 99, icon: 'icon-storm.webp' },
        ];

        const match = ranges.find(({ max }) => weatherCode <= max);
        return match ? `${prefixPath}${match.icon}` : '';
    }
}
