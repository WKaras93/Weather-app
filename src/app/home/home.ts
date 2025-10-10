import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header';
import { MainContentComponent } from '../main-content/main-content';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, MainContentComponent],
  templateUrl: './home.html',
  styleUrl: './home.less'
})
export class HomeComponent {

}

