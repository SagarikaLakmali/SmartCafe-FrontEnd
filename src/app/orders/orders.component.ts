import { Component, OnInit } from '@angular/core';
import { Menu } from '../model/Menu';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AllMenusResponse } from '../model/AllMenusResponse';
import { AllOrdersResponse } from '../model/AllOrdersResponse';
import { stringify } from 'querystring';
import { CommonResponse } from '../model/CommonResponse';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { TokenStorageService } from '../auth/token-storage.service';
import { OrderService } from '../services/order.service';
import { Order } from '../model/Order';

@Component({
  selector: 'app-user',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  constructor(private confirmationService: ConfirmationService, private tokenStorage: TokenStorageService, private orderService: OrderService) { }  
  
  loaded: boolean;
  errorMessage: string;
  successMessage: string;
  error: boolean;
  success: boolean;
  isSelected: boolean;

  response: CommonResponse= {
    code: null,
    message: null
  }

  filterMenuName: string;  
  page: number;
  paginator: boolean = true;
  loading: boolean;
  message: any;
  allOrdersResponse : AllOrdersResponse;
  orders: Array<Order>;
  loggedInUser = this.tokenStorage.getUsername();

  ngOnInit() {
    this.isSelected = false;
    this.loaded = false;
    this.getAllOrders(true);
    
  }

  close(){
    this.error = false;
    this.success = false;
  }

  getAllOrders(reset: boolean) {
    if (reset) {
      this.page = 0;
    }

    this.orderService.findAllOrdersforManager(this.page)
      .subscribe((allOrdersResponse: AllOrdersResponse) => {
        this.allOrdersResponse = allOrdersResponse
        this.loaded = true;
        if (this.allOrdersResponse.content.length == 0) {
          this.paginator = false;
        } else {
          this.paginator = true;
        }
        this.loading = false;
      }
      ); 
  }

  fetchOrdersLazy(event) {
    this.loading = true;
    this.page = event.first / 12;

    this.getAllOrders(false);
  }

  public replace(content: string) {
    return content.replace(/_/g, " ");
  }
}

