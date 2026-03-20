import { Component } from '@angular/core';
import { UnitsComponent } from '../units-component/units-component';

@Component({
  selector: 'app-header',
  imports: [UnitsComponent],
  templateUrl: './header.html',
  styleUrl: './header.less'
})
export class HeaderComponent {

}
