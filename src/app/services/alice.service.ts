import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Company } from '../interfaces/company.interface';
import { Servicio } from '../interfaces/servicio.interface';
import { Enlace } from '../interfaces/enlace.interface';
import { Respuesta } from '../interfaces/respuesta.interface';

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

  public sumAntenasHoteles(params: { token_uuid: string}): Observable<any> {
    return this.buildQuery('post', 'sumAntenasHoteles', params);
  }

  public getVerticalSurvey(token_uuid: string): Observable<any> {
    return this.buildQuery('get', `getVerticalSurvey/${token_uuid}`);
  }

  public getQuestionsByVertical(vertical: number): Observable<any>{
    return this.buildQuery('get', `getQuestionsByVertical/${vertical}`);
  }

  public getSurvey(token_uuid: string): Observable<any> {
    return this.buildQuery('get', `survey/${token_uuid}`);
  }

  public createSurvey(params: { token_uuid: string}): Observable<any> {
    return this.buildQuery('post', 'survey', params);
  }

  public setStatusSurvey(params: { token_uuid: string}): Observable<any> {
    return this.buildQuery('post', 'setStatusSurvey', params);
  }

  public sendEmailComercial(token_uuid: string): Observable<any> {
    return this.buildQuery('get', `send_notification_survey/${token_uuid}`);
  }

  public getOrCreateSurvey(token: string){ 
     this.getSurvey(token).subscribe(res => { 
        if(res.data == null || res.data.length == 0){
            this.createSurvey({token_uuid: token}).subscribe(res => {})
        }
     });  
  }

  /* CONTACTO */ 

  public getSurveyCompany(token_uuid : string): Observable<any> {
    return this.buildQuery('get', `company/${token_uuid}`);
  }

  public storeSurveyCompany(company: Company): Observable<any> {
    return this.buildQuery('post', 'company', company);
  }

  /* SERVICIO */ 

  public getSurveyServicio(token_uuid : string): Observable<any> {
    return this.buildQuery('get', `servicio/${token_uuid}`);
  }

  public storeSurveyServicio(servicio: Servicio): Observable<any> {
    return this.buildQuery('post', 'servicio', servicio);
  }

  public storeSurveyVertical(servicio: Servicio): Observable<any> {
    return this.buildQuery('post', 'vertical', servicio);
  }

  /* Enlace */ 

  public getTipoEnlace(): Observable<any> {
    return this.buildQuery('get', 'tipo_enlace');
  }

  public getAnchoBanda(): Observable<any> {
    return this.buildQuery('get', 'ancho_banda');
  }

  public getSurveyEnlace(token_uuid : string): Observable<any> {
    return this.buildQuery('get', `enlace/${token_uuid}`);
  }

  public storeSurveyEnlace(enlace: Enlace): Observable<any> {
    return this.buildQuery('post', 'enlace', enlace);
  }

  //Renta

  public getPlazo(): Observable<any> {
    return this.buildQuery('get', `plazo`);
  }

  public getSurveyRenta(token_uuid : string): Observable<any> {
    return this.buildQuery('get', `renta/${token_uuid}`);
  }

  public storeSurveyRenta(enlace: Enlace): Observable<any> {
    return this.buildQuery('post', 'renta', enlace);
  }

  //Guardar preguntas 
  public storeResult(respuesta: Respuesta): Observable<any> {
    return this.buildQuery('post', 'saveSurveyResult', respuesta);
  }

}
