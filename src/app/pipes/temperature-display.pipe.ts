import { Pipe, PipeTransform } from '@angular/core';
import { UnitService, UnitSystem } from '../services/unit/unit-service';

@Pipe({
    name: 'temperatureDisplay',
    pure: false
})
export class TemperatureDisplayPipe implements PipeTransform {
    private unit: UnitSystem = 'metric';

    constructor(private unitService: UnitService) {
        this.unitService.currentUnitSystem$.subscribe((unitSystem: UnitSystem) => {
            this.unit = unitSystem;
        });
    }

    transform(value: number | null | undefined): string {
        if (!value && value !== 0) {
            return '';
        }

        const unitSymbol = this.unit === 'metric' ? '°C' : '°F';
        return `${value}${unitSymbol}`;
    }
}