import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Order } from '../model/Order';
import { TokenStorageService } from '../auth/token-storage.service';
import { OrderService } from '../services/order.service';
import { CommonResponse } from '../model/CommonResponse';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-user',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  
  loaded: boolean;

  response: CommonResponse= {
    code: null,
    message: null
  }

  constructor(private userService: UserService, private tokenStorage: TokenStorageService, private reportService: ReportService) { }

  ngOnInit() {
    this.loaded = true;
  }

  generateDailySalesReport(){
    this.loaded = false;
    this.reportService.getDailySalesReport().subscribe((response)=>{
      console.log(JSON.stringify(response));
      let file = new Blob([response], { type: 'application/pdf' });            
      var fileURL = URL.createObjectURL(file);
      this.loaded = true;
      window.open(fileURL);
    });
  }

  generateWeeklySalesReport(){
    this.loaded = false;
    this.reportService.getWeeklySalesReport().subscribe((response)=>{
      console.log(JSON.stringify(response));
      let file = new Blob([response], { type: 'application/pdf' });            
      var fileURL = URL.createObjectURL(file);
      this.loaded = true;
      window.open(fileURL);
    });
  }

  generateMonthlySalesReport(){
    this.loaded = false;
    this.reportService.getMonthlySalesReport().subscribe((response)=>{
      console.log(JSON.stringify(response));
      let file = new Blob([response], { type: 'application/pdf' });            
      var fileURL = URL.createObjectURL(file);
      this.loaded = true;
      window.open(fileURL);
    });
  }

  generateItemDemandReport(){
    this.loaded = false;
    this.reportService.getItemDemandReport().subscribe((response)=>{
      console.log(JSON.stringify(response));
      let file = new Blob([response], { type: 'application/pdf' });            
      var fileURL = URL.createObjectURL(file);
      this.loaded = true;
      window.open(fileURL);
    });
  }
}
