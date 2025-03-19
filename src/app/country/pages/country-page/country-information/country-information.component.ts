import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import type { Country } from '../../../interfaces/country.interface';

@Component({
  selector: 'country-information',
  imports: [DecimalPipe],
  templateUrl: './country-information.component.html',
})
export class CountryInformationComponent {
  country = input.required<Country>();
}
