import { Component, inject, linkedSignal, signal } from '@angular/core';
import { of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { CountrySearchInputComponent } from "../../components/country-search-input/country-search-input.component";
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'by-capital-page',
  imports: [CountrySearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html'
})
export class ByCapitalPageComponent {

  countryService = inject(CountryService);

  //Obtenemos la ruta de la página
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';

  query = linkedSignal<string>(() =>this.queryParam);

  //! Funciona con rxResource y observables
    countryResource = rxResource({
      request: () => ({ query: this.query() }),
      loader: ({ request }) => {
        // console.log({query: request.query});
        if( !request.query ) return of([]);

        //actualizar el url
        this.router.navigate(['/country/by-capital'], { queryParams: { query: request.query } });

        return this.countryService.searchByCapital(request.query);
      }
    })


  //! Funciona con resourse y promesas
  // countryResource = resource({
  //   //regresa un objeto
  //   request: () => ({ query: this.query() }),

  //   //Se manda llamar cada que los volores del 'request' cambien
  //   loader: async ({ request }) =>  {
  //     if( !request.query ) return [];

  //     //firsValueFrom => permite pasar cualquier observable a una promesa

  //     return await firstValueFrom(this.countryService.searchByCapital(request.query));
  //   }
  // })

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
