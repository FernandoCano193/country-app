import { Component, inject, signal } from '@angular/core';
import { CountryListComponent } from "../../components/country-list/country-list.component";
import type { Region } from '../../types/region.type';
import { CountryService } from '../../services/country.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

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
    'Oceania',
    'Antarctic'];

  countryService = inject(CountryService);

  selectedRegion = signal<Region | null> (null);

  regionResource = rxResource({
    request: () => ({ region: this.selectedRegion() }),
    loader: ({ request }) => {
      if( !request.region ) return of([]);

      return this.countryService.searchByRegion(request.region);
    }
  })


}
