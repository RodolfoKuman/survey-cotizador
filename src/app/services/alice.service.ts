import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AliceService {

  private URL_API ='https://alice.sitwifi.com/api/';

  private buildQuery<T>( method: string, path: string, params?: any, headers?: any ) {
    switch ( method.toLocaleLowerCase() ) {
      case 'get': return this.http.get<T>(this.URL_API.concat(path), { headers });
      case 'post': return this.http.post<T>(this.URL_API.concat(path), params);
      case 'put': return this.http.put<T>(this.URL_API.concat(path), params);
      case 'delete': return this.http.delete<T>(this.URL_API.concat(path));
    }
  }

  constructor(private http: HttpClient) { }

}
