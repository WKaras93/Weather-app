import { Component, OnDestroy } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CitiesSearchService, CityResult } from '../services/cities/cities-search-service';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { WeatherFacadeService } from '../services/weather-facade/weather-facade.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search-component',
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatAutocompleteModule
],
  templateUrl: './search-component.html',
  styleUrl: './search-component.less'
})
export class SearchComponent implements OnDestroy {
  public searchLocationValue: string = '';
  public citySuggestions: CityResult[] = [];

  private searchInput$ = new Subject<string>();
  private destroy$ = new Subject<void>();
  private selectedCity: CityResult | null = null;

  constructor(
    private _citiesSearchService: CitiesSearchService,
    private _weatherFacadeService: WeatherFacadeService
  ) {
    this.searchInput$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value || value.length < 3) {
          this.citySuggestions = [];
          return [];
        }
        return this._citiesSearchService.getSearchCities(value);
      }),
      takeUntil(this.destroy$)
    ).subscribe(cities => {
      this.citySuggestions = cities;
    });
  }

  public clearInput(searchInputRef: HTMLInputElement) {
    this.searchLocationValue = '';
    this.selectedCity = null;
    this.citySuggestions = [];
    searchInputRef.focus();
  }

  public searchLocation() {
    if (!this.selectedCity) return;
    this._weatherFacadeService.searchCity(this.selectedCity);
  }

  public onSearchChange(value: string) {
    this.searchLocationValue = value;
    this.searchInput$.next(value);
    this.searchLocation();
  }

  public selectCity(city: CityResult) {
    this.selectedCity = city;
    this.searchLocationValue = city.name;
    this.citySuggestions = [];
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
