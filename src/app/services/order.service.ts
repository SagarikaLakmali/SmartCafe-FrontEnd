import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../auth/token-storage.service';
import { Menu } from '../model/Menu';
import { CommonResponse } from '../model/CommonResponse';
import { AllOrdersResponse } from '../model/AllOrdersResponse';
import { Order } from '../model/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private tokenService: TokenStorageService) { }

  readonly apiEndPoint = environment.apiEndPoint;
  public headers = new HttpHeaders({ 'Authorization': 'Bearer '+this.tokenService.getToken(), 'Content-Type': 'application/json' })

  createOrder(items: Menu[], customer: string): Observable<CommonResponse> {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer '+this.tokenService.getToken() });
    return this.http.post<CommonResponse>(this.apiEndPoint + 'order/create?table='+customer, items, { headers });
  }

  findAllOrders(customer: string): Observable<Order[]> {
    const headers = this.headers
    return this.http.get<Order[]>(this.apiEndPoint + 'order/search/'+customer, { headers });
  }

  findAllPendingOrdersforKitchen(page: number): Observable<AllOrdersResponse> {
    const headers = this.headers
    return this.http.post<AllOrdersResponse>(this.apiEndPoint + 'order/search/kitchen/' + page, { headers });
  }

  updateOrder(order: Order): Observable<CommonResponse> {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer '+this.tokenService.getToken() });
    return this.http.put<CommonResponse>(this.apiEndPoint + 'order/update', order, { headers });
  }
  
  findAllPendingOrdersforSteward(page: number): Observable<AllOrdersResponse> {
    const headers = this.headers
    return this.http.post<AllOrdersResponse>(this.apiEndPoint + 'order/search/steward/' + page, { headers });
  }
  
  findAllPendingOrdersforCashier(page: number): Observable<AllOrdersResponse> {
    const headers = this.headers
    return this.http.post<AllOrdersResponse>(this.apiEndPoint + 'order/search/cashier/' + page, { headers });
  }

  getBill(orderId: string){
    const url = this.apiEndPoint + 'report/bill/'+orderId;
    const httpOptions = {
      'responseType'  : 'arraybuffer' as 'json'
    };
    
    return this.http.get<any>(url, httpOptions);
  }

  findAllOrdersforManager(page: number): Observable<AllOrdersResponse> {
    const headers = this.headers
    return this.http.post<AllOrdersResponse>(this.apiEndPoint + 'order/search/manager/' + page, { headers });
  }
}
