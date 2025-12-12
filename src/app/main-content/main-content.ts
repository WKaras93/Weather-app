import { Component } from '@angular/core';

import { SearchComponent } from '../search-component/search-component';
import { ForecastComponent } from '../forecast-component/forecast-component';

@Component({
  selector: 'app-main-content',
  imports: [
    SearchComponent,
    ForecastComponent
  ],
  templateUrl: './main-content.html',
  styleUrl: './main-content.less'
})
export class MainContentComponent {

}
