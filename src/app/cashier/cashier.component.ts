import { Component, OnInit, ElementRef } from '@angular/core';
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
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.css']
})
export class CashierComponent implements OnInit {

  constructor(private confirmationService: ConfirmationService, private tokenStorage: TokenStorageService, private orderService: OrderService, private elementRed: ElementRef) { }  
  
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
  }

  close(){
    this.error = false;
    this.success = false;
  }

  getAllOrders(reset: boolean) {
    if (reset) {
      this.page = 0;
    }

    this.orderService.findAllPendingOrdersforCashier(this.page)
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

  generateBill(order: Order){
    this.success = false;
    this.error = false;

    this.orderService.getBill(order.id).subscribe((response)=>{
      console.log(JSON.stringify(response));
      let file = new Blob([response], { type: 'application/pdf' });            
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    })
    order.status = "PAYMENT_PENDING";
    this.orderService.updateOrder(order)
        .subscribe(r => {
          this.response = r;

          if(this.response.code != null && this.response.code == "200"){
            this.success = true;
            this.successMessage = "Bill Generated."
          }else{
            this.error = true;
            this.errorMessage = this.response.message;
          }
          this.ngOnInit();
        }, error => {
          this.errorMessage = error.error.message;
          this.error = true;
        });
  }

  processPayment(order: Order){
    this.success = false;
    this.error = false;

    order.status = "PAID";
    this.orderService.updateOrder(order)
        .subscribe(r => {
          this.response = r;

          if(this.response.code != null && this.response.code == "200"){
            this.successMessage = "Order "+order.guid+ " Paid Successfully.";
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

  complete(order: Order){
    this.success = false;
    this.error = false;

    order.status = "COMPLETED";
    this.orderService.updateOrder(order)
        .subscribe(r => {
          this.response = r;

          if(this.response.code != null && this.response.code == "200"){
            this.successMessage = "Order "+order.guid+ " Completed Successfully.";
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

