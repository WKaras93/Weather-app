import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type UnitSystem = 'metric' | 'imperial';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  private unitSystem$ = new BehaviorSubject<UnitSystem>('metric');

  currentUnitSystem$ = this.unitSystem$.asObservable();

  setUnitSystem(system: UnitSystem) {
    this.unitSystem$.next(system);
  }

  get currentUnitSystem(): UnitSystem {
    return this.unitSystem$.getValue();
  }
}
