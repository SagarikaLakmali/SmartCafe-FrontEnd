import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../auth/token-storage.service';
import { Department } from '../model/Department';
import { AllDepartmentsResponse } from '../model/AllDepartmentsResponse';
import { CommonResponse } from '../model/CommonResponse';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient, private tokenService: TokenStorageService) { }

  readonly apiEndPoint = environment.apiEndPoint;
  public headers = new HttpHeaders({ 'Authorization': 'Bearer '+this.tokenService.getToken(), 'Content-Type': 'application/json' })

  createDepartment(department: Department): Observable<CommonResponse> {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer '+this.tokenService.getToken() });
    return this.http.post<CommonResponse>(this.apiEndPoint + 'department/create', department, { headers });
  }

  findAllDepartments(page: number): Observable<AllDepartmentsResponse> {
    const headers = this.headers
    return this.http.post<AllDepartmentsResponse>(this.apiEndPoint + 'department/search/' + page, { headers });
  }

  deleteDepartment(id: string): Observable<CommonResponse> {
    const headers = this.headers;
    return this.http.delete<CommonResponse>(this.apiEndPoint + 'department/delete?id='+id, { headers });
  }

  getAllDepartments(): Observable<Department[]> {
    const headers = this.headers;
    return this.http.get<Department[]>(this.apiEndPoint + 'department/all', { headers });
  }

  getDepartment(department: string): Observable<Department> {
    const headers = this.headers;
    return this.http.get<Department>(this.apiEndPoint + 'department/getbyname?name='+department, { headers });
  }

}
