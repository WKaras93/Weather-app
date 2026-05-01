
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { UnitService } from '../services/unit/unit-service';

@Component({
  selector: 'app-units-component',
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule
],
  templateUrl: './units-component.html',
  styleUrl: './units-component.less'
})
export class UnitsComponent {
  public isMetric: boolean = true;
  public menuOpen: boolean = false;

  constructor(private unitsService: UnitService) {}

  public toggleUnits(): void {
    this.isMetric = !this.isMetric;
    const nextUnit = this.isMetric ? 'metric' : 'imperial';
    this.unitsService.setUnitSystem(nextUnit);
  }
}
