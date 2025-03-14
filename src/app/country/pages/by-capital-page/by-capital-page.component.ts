import { Component, inject, resource, signal } from '@angular/core';
import { CountrySearchInputComponent } from "../../components/country-search-input/country-search-input.component";
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { CountryService } from '../../services/country.service';
import type { Country } from '../../interfaces/country.interface';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'by-capital-page',
  imports: [CountrySearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html'
})
export class ByCapitalPageComponent {

  countryService = inject(CountryService);
  query = signal<string>('');

  countryResource = resource({
    //regresa un objeto
    request: () => ({ query: this.query() }),

    //Se manda llamar cada que los volores del 'request' cambien
    loader: async ({ request }) =>  {
      if( !request.query ) return [];

      //firsValueFrom => permite pasar cualquier observable a una promesa

      return await firstValueFrom(this.countryService.searchByCapital(request.query));
    }
  })

  // // compatible con version de Angular >= 18
  // isLoading = signal(false);
  // isError = signal<string | null>(null);
  // countries = signal<Country[]>([]);

  // onSearch(query: string) {
  //   if (this.isLoading()) return;

  //   this.isLoading.set(true);
  //   this.isError.set(null);

  //   //Se recupera la información de los países mapeada
  //   this.countryService.searchByCapital(query)
  //     .subscribe({
  //       //next => se recupera la información de los países con éxito
  //       next: (countries) => {
  //         this.isLoading.set(false);
  //         this.countries.set(countries);
  //       },

  //       //error => se recupera la información de los países con error
  //       error: (err) => {
  //         this.isLoading.set(false);
  //         this.countries.set([]);
  //         this.isError.set(err);
  //       }

  //       //complete => se termina de recuperar la información de los países
  //     });
  // }
}
