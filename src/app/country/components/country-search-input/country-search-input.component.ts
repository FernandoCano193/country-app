import { Component, effect, input, linkedSignal, output, signal } from '@angular/core';

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
  initialValue = input<string>();

  inputValue = linkedSignal<string>(() => this.initialValue() ?? '');

  debounceEffect = effect((onCleanup) => {
    //Angular detecta que hay una signal y cada vez que cambie se va a disparar el effect
    const value = this.inputValue();

    const timeout = setTimeout(()=>{
      this.value.emit(value);
    }, 500);

    onCleanup(()=>{
      clearTimeout(timeout)
    })
  })
}
