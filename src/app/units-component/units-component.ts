import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UnitService } from '../services/unit/unit-service';

@Component({
  selector: 'app-units-component',
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './units-component.html',
  styleUrl: './units-component.less'
})
export class UnitsComponent {
  public isMetric: boolean = true;

  constructor(private unitsService: UnitService) {}

  public toggleUnits(): void {
    this.isMetric = !this.isMetric;
    const nextUnit = this.isMetric ? 'metric' : 'imperial';
    this.unitsService.setUnitSystem(nextUnit);
  }
}
