import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../auth/token-storage.service';
import { Menu } from '../model/Menu';
import { AllMenusResponse } from '../model/AllMenusResponse';
import { CommonResponse } from '../model/CommonResponse';
import { RequestModel } from '../model/RequestModel';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient, private tokenService: TokenStorageService) { }

  readonly apiEndPoint = environment.apiEndPoint;
  public headers = new HttpHeaders({ 'Authorization': 'Bearer '+this.tokenService.getToken(), 'Content-Type': 'application/json' })

  createMenu(menu: Menu): Observable<CommonResponse> {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer '+this.tokenService.getToken() });
    return this.http.post<CommonResponse>(this.apiEndPoint + 'menu/create', menu, { headers });
  }

  findAllMenus(requestModel: RequestModel, page: number): Observable<AllMenusResponse> {
    const headers = this.headers
    return this.http.post<AllMenusResponse>(this.apiEndPoint + 'menu/search/' + page, requestModel, { headers });
  }

  deleteMenu(id: string): Observable<CommonResponse> {
    const headers = this.headers;
    return this.http.delete<CommonResponse>(this.apiEndPoint + 'menu/delete?id='+id, { headers });
  }

}
