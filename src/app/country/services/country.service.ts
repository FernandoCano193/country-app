import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { RESTCountry } from '../interfaces/rest-countries.interface';
import { map, catchError, throwError } from 'rxjs';
import { CountryMappers } from '../mappers/country.mapper';

const API_URL = "https://restcountries.com/v3.1"

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);


  searchByCapital ( query:string )  {
    query = query.toLowerCase();

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`)
      .pipe(
        map( resp => CountryMappers.mapRestCountriesToCountries(resp)),
        catchError( error => { //Se captura cualquier error
          console.log('Error fetching ', error);

          return throwError(() => Error(`No se pudo obtener paises con el query: ${query}`)); // Se debe de retornar el error
        })
      );
  }

  searchByCountry( query:string ) {
    query = query.toLowerCase();

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`)
      .pipe(
        map( resp => CountryMappers.mapRestCountriesToCountries(resp)),

        //Manejo de errores
        catchError( error => {
          console.log('Error fetching ', error);

          return throwError(() => Error(`No se pudo obtener paises con el query: ${query}`)); // Se debe de retornar el error
        })
      )
  }
}
