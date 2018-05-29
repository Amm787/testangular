import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Hero } from './hero';
// import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HeroService {

  private heroesUrl = 'api/heroes'; // URL to web api

  constructor(private messageService: MessageService,
    private http: HttpClient) { }

  // getHeroes(): Observable<Hero[]> {
  //   // Todo: send the message _after_ fetching the heroes
  //   this.log('fetched heroes');
  //   return of(HEROES);
  // }

  // getHero(id: number): Observable<Hero> {
  //   this.log(`fetched hero id=${id} `);
  //   return of(HEROES.find(h => h.id === id));
  // }

  // Get heroes from the server
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
      tap(h => this.log(`fetched heroes ${h[1].name}`)),
      catchError(this.handleError('getHeroes', [])));
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).
      pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  updateHero(hero: Hero): Observable<any> {
    // const httpOptions = {
    //   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    // };
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero')));
  }

  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe
      (tap((h: Hero) => this.log(`added hero w/ id=${h.id}`),
        catchError(this.handleError<Hero>('addHero'))));
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe
      (tap(_ => this.log(`deleted hero id = ${id}`)),
      catchError(this.handleError<Hero>(`deleteHero`))
      );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, retrun empty hero array
      return of([]);
    }

    return this.http.get<Hero[]>(`api/heroes/?name=${term}`).pipe
      (tap(_ => this.log(`foud heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', [])));
  }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failedl
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
