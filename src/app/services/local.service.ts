import { Injectable } from '@angular/core';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor() { }

  public createTokenUUID(){
    let token = uuid.v4();
    this.saveTokenLocalStorage(token);   
  }

  public getToken() {
    let token = this.getItemLocalStorage('token');
    //Si el token no existe lo crea
    if(!token){
      this.createTokenUUID(); 
    } 

    return token;
  }

  public saveTokenLocalStorage(token: any){
    localStorage.setItem('token', token);
  }
  
  public getItemLocalStorage(item : string){
    return localStorage.getItem(item);
  }

}

