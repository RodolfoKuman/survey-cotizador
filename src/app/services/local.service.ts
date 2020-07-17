import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor() { }

  public saveTokenLocalStorage(token: any){
    localStorage.setItem('token', token);
  }
  
  public getTokenLocalStorage(){
    return localStorage.getItem('token');
  }

}

