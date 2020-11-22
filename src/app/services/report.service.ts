import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../auth/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient, private tokenService: TokenStorageService) { }

  readonly apiEndPoint = environment.apiEndPoint;
  public headers = new HttpHeaders({ 'Authorization': 'Bearer '+this.tokenService.getToken(), 'Content-Type': 'application/json' })

  getDailySalesReport(){
    const url = this.apiEndPoint + 'report/dailysales';
    const httpOptions = {
      'responseType'  : 'arraybuffer' as 'json'
    };
    
    return this.http.get<any>(url, httpOptions);
  }

  getWeeklySalesReport(){
    const url = this.apiEndPoint + 'report/weeklysales';
    const httpOptions = {
      'responseType'  : 'arraybuffer' as 'json'
    };
    
    return this.http.get<any>(url, httpOptions);
  }

  getMonthlySalesReport(){
    const url = this.apiEndPoint + 'report/monthlysales';
    const httpOptions = {
      'responseType'  : 'arraybuffer' as 'json'
    };
    
    return this.http.get<any>(url, httpOptions);
  }

  getItemDemandReport(){
    const url = this.apiEndPoint + 'report/itemdemand';
    const httpOptions = {
      'responseType'  : 'arraybuffer' as 'json'
    };
    
    return this.http.get<any>(url, httpOptions);
  }
  
}
