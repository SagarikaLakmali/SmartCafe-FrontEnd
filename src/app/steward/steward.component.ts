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
  templateUrl: './steward.component.html',
  styleUrls: ['./steward.component.css']
})
export class StewardComponent implements OnInit {

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
  cartItems: Menu[] = [];
  cartSize: number;
  showCart: boolean = false;
  ordertotal: number = 0;
  orderStatus: boolean = false;
  orderStatusView = false;
  allOrdersResponse : AllOrdersResponse;
  orders: Array<Order>;
  loggedInUser = this.tokenStorage.getUsername();

  ngOnInit() {
    this.isSelected = false;
    this.loaded = false;
    this.getAllOrders(true);
    this.loaded = true;
  }

  close(){
    this.error = false;
    this.success = false;
  }

  getAllOrders(reset: boolean) {
    if (reset) {
      this.page = 0;
    }

    this.orderService.findAllPendingOrdersforSteward(this.page)
      .subscribe((allOrdersResponse: AllOrdersResponse) => {
        this.allOrdersResponse = allOrdersResponse
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

  assignedToMe(order: Order){
    this.success = false;
    this.error = false;

    order.status = "ASSIGNED_STEWARD";
    order.steward = this.tokenStorage.getUsername();
    this.orderService.updateOrder(order)
        .subscribe(r => {
          this.response = r;

          if(this.response.code != null && this.response.code == "200"){
            this.successMessage = "Order "+order.guid+" Assigned.";
            this.success = true;
          }else{
            this.error = true;
            this.errorMessage = this.response.message;
          }
          this.orderStatus = true;
          this.ngOnInit();
        }, error => {
          this.errorMessage = error.error.message;
          this.error = true;
        }); 
  }

  deliveryCompleted(order: Order){
    this.success = false;
    this.error = false;

    order.status = "DELIVERED";
    order.steward = this.tokenStorage.getUsername();
    this.orderService.updateOrder(order)
        .subscribe(r => {
          this.response = r;

          if(this.response.code != null && this.response.code == "200"){
            this.successMessage = "Order "+order.guid+ " is Delivered to "+order.tableName;
            this.success = true;
          }else{
            this.error = true;
            this.errorMessage = this.response.message;
          }
          this.orderStatus = true;
          this.ngOnInit();
        }, error => {
          this.errorMessage = error.error.message;
          this.error = true;
        }); 
  }
}

