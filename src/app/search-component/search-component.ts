import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CitiesSearchService, CityResult } from '../services/cities/cities-search-service';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-component',
  imports: [
    CommonModule,
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
export class SearchComponent {
  public searchLocationValue: string = '';
  citySuggestions: CityResult[] = [];

  constructor(private _citiesSearchService: CitiesSearchService) {}

  public clearInput(searchInputRef: HTMLInputElement) {
    this.searchLocationValue = '';
    searchInputRef.focus();
  }

  public searchLocation() {
    
  }

  onSearchChange(value: string) {
    console.log('onSearchChange')
    this.searchLocationValue = value;

    if (!value || value.length < 3) {
      this.citySuggestions = [];
      return;
    }

    this._citiesSearchService.getSearchCities(value).subscribe(cities => {
      this.citySuggestions = cities;
    })
  }

  selectCity(city: CityResult) {
    
  }
}
