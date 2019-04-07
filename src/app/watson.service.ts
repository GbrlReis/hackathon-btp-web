import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class WatsonService {

  baseUrl:string;
  username:string;
  password:string;
  token:string;

  constructor(private http: HttpClient) {
   }

  getProbability(berth_window, ata, atb, ats, name, service, liner, berth) {
    return this.http.get('https://us-central1-thanos-188223.cloudfunctions.net/probability', {
      params : {
        berth_window: berth_window,
        ata: ata,
        atb: atb,
        ats: ats,
        name: name,
        service: service,
        liner: liner,
        berth: berth
      }
    }).toPromise().then((res) => {
      console.log(res)
      return res;
    })
  }

  
}