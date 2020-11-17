import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../auth/token-storage.service';
import { Role } from '../model/Role';
import { AllRolesResponse } from '../model/AllRolesResponse';
import { CommonResponse } from '../model/CommonResponse';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient, private tokenService: TokenStorageService) { }

  readonly apiEndPoint = environment.apiEndPoint;
  public headers = new HttpHeaders({ 'Authorization': 'Bearer '+this.tokenService.getToken(), 'Content-Type': 'application/json' })

  createRole(role: Role): Observable<CommonResponse> {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer '+this.tokenService.getToken() });
    return this.http.post<CommonResponse>(this.apiEndPoint + 'role/create', role, { headers });
  }

  findAllRoles(page: number): Observable<AllRolesResponse> {
    const headers = this.headers
    return this.http.post<AllRolesResponse>(this.apiEndPoint + 'role/search/' + page, { headers });
  }

  deleteRole(id: string): Observable<CommonResponse> {
    const headers = this.headers;
    return this.http.delete<CommonResponse>(this.apiEndPoint + 'role/delete?id='+id, { headers });
  }

  getAllRoles(): Observable<Role[]> {
    const headers = this.headers;
    return this.http.get<Role[]>(this.apiEndPoint + 'role/all', { headers });
  }

  getRole(role: string): Observable<Role> {
    const headers = this.headers;
    return this.http.get<Role>(this.apiEndPoint + 'role/getbyname?name='+role, { headers });
  }
}
