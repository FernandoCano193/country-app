import type { Country } from "../interfaces/country.interface";
import type { RESTCountry } from "../interfaces/rest-countries.interface";

export class CountryMappers {
  //static RestCountry => country
  static mapRestCountryToCountry( restCountry: RESTCountry ): Country {
    return {
      cca2: restCountry.cca2,
      flag: restCountry.flag,
      flagSvg: restCountry.flags.svg,
      name: restCountry.translations['spa'].common ?? 'Nombre en Español no disponible',
      capital: restCountry.capital.join(', '),
      population: restCountry.population,
      region: restCountry.region,
      subRegion: restCountry.subregion
    }
  }

  //static RestCountry[] => Country[]
  static mapRestCountriesToCountries( restCountries: RESTCountry[] ): Country[] {
    return restCountries.map(this.mapRestCountryToCountry);
  }
}
