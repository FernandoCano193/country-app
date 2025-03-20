import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, catchError, throwError, delay, of, tap } from 'rxjs';
import { CountryMappers } from '../mappers/country.mapper';
import type { RESTCountry } from '../interfaces/rest-countries.interface';
import type { Country } from '../interfaces/country.interface';
import type { Region } from '../types/region.type';

const API_URL = "https://restcountries.com/v3.1"

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);

  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<String, Country[]>();
  private queryCacheRegion = new Map<Region, Country[]>();

  searchByCapital ( query:string )  {
    query = query.toLowerCase();

    //Se hace la búsqueda en el cache
    if(this.queryCacheCapital.has(query)) {
      return of(this.queryCacheCapital.get(query) ?? []);
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`)
      .pipe(
        map( resp => CountryMappers.mapRestCountriesToCountries(resp)),

        //Almacenamiento de la búsqueda en el cache
        tap(countries => this.queryCacheCapital.set(query, countries)),

        catchError( error => { //Se captura cualquier error
          console.log('Error fetching ', error);

          return throwError(() => Error(`No se pudo obtener paises con el query: ${query}`)); // Se debe de retornar el error
        })
      );
  }

  searchByCountry( query:string ) {
    query = query.toLowerCase();

    //Se hace la busqueda en el cache
    if(this.queryCacheCountry.has(query)){
      return of(this.queryCacheCountry.get(query) ?? []);
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`)
      .pipe(
        map( resp => CountryMappers.mapRestCountriesToCountries(resp)),

        //almacenamos la búsqueda en el cache
        tap(countries => this.queryCacheCountry.set(query, countries)),

        // delay(2000),

        //Manejo de errores
        catchError( error => {
          console.log('Error fetching ', error);

          return throwError(() => Error(`No se pudo obtener paises con el query: ${query}`)); // Se debe de retornar el error
        })
      )
  }

  searchCountryByAlphaCode( code:string ) {
    const url = `${API_URL}/alpha/${code}`

    return this.http.get<RESTCountry[]>(url)
      .pipe(
        map( resp => CountryMappers.mapRestCountriesToCountries(resp)),
        map( countries => countries.at(0)),

        //Manejo de errores
        catchError( error => {
          console.log('Error fetching ', error);

          return throwError(() => Error(`No se pudo obtener paises con el código: ${code}`)); // Se debe de retornar el error
        })
      )
  }

  searchByRegion( region:Region ) {
    const url = `${API_URL}/region/${region}`

    if(this.queryCacheRegion.has(region)){
      return of(this.queryCacheRegion.get(region) ?? []);
    }

    return this.http.get<RESTCountry[]>(url)
      .pipe(
        map( resp => CountryMappers.mapRestCountriesToCountries(resp)),

        tap(countries => this.queryCacheRegion.set(region, countries)),

        //manejo de errores
        catchError( error => {
          console.log('Error fetching ', error);

          return throwError(() => Error(`No se pudo obtener paises con la región: ${region}`)); // Se debe de retornar el error
        })
      )
  }

}
