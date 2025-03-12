import { Component, input, output } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './country-search-input.component.html',
})
export class CountrySearchInputComponent {

  //emitir el valor del input
  value = output<string>();

  //recibe el placeholder como parámetro y se asigna 'Buscar' por defecto
  placeholder= input<string>('Buscar');
}
