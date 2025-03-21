import { Component, inject, linkedSignal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

import { CountryListComponent } from "../../components/country-list/country-list.component";
import type { Region } from '../../types/region.type';
import { CountryService } from '../../services/country.service';

function validateRegionParam(queryParam: string): Region {
  queryParam = queryParam.toLowerCase();

  const validRegions: Record<string, Region> = {
    'africa': 'Africa',
    'americas': 'Americas',
    'asia': 'Asia',
    'europe': 'Europe',
    'oceania': 'Oceania',
    'antarctic': 'Antarctic'
  };

  return validRegions[queryParam] ?? 'Americas';
}

@Component({
  selector: 'by-region-page',
  imports: [CountryListComponent],
  templateUrl: './by-region-page.component.html',
})
export class ByRegionPageComponent {

  public regions: Region[] = ['Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania', 'Antarctic'];

  countryService = inject(CountryService);

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  //! EVITAR HACER ESTOO!
  // queryParam = (this.activatedRoute.snapshot.queryParamMap.get('region') ?? null) as Region;

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('region') ?? '';

  selectedRegion = linkedSignal<Region>(() => validateRegionParam(this.queryParam));

  regionResource = rxResource({
    request: () => ({ region: this.selectedRegion() }),
    loader: ({ request }) => {
      if( !request.region ) return of([]);

      //actualizar el url
      this.router.navigate(['country/by-region'], {
        queryParams: { region: request.region }
      })

      return this.countryService.searchByRegion(request.region);
    }
  })


}
