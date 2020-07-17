import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const URL_API = environment.URI_BASE;

@Injectable({
  providedIn: 'root'
})
export class AliceService {

  private buildQuery<T>( method: string, path: string, params?: any, headers?: any ) {
    switch ( method.toLocaleLowerCase() ) {
      case 'get': return this.http.get<T>(URL_API.concat(path), { headers });
      case 'post': return this.http.post<T>(URL_API.concat(path), params);
      case 'put': return this.http.put<T>(URL_API.concat(path), params);
      case 'delete': return this.http.delete<T>(URL_API.concat(path));
    }
  }

  constructor(private http: HttpClient) { }

  public getVerticales(): Observable<any> {
    return this.buildQuery('get', 'verticales');
  }

}
