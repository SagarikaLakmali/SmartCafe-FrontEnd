import { Component, OnInit } from '@angular/core';
import { Table } from '../model/Table';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TableService } from '../services/table.service';
import { AllTablesResponse } from '../model/AllTablesResponse';
import { stringify } from 'querystring';
import { CommonResponse } from '../model/CommonResponse';
import { ConfirmationService } from 'primeng/api';
import { TokenStorageService } from '../auth/token-storage.service';

@Component({
  selector: 'app-user',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor(private tableService:TableService, private confirmationService: ConfirmationService, private tokenStorage: TokenStorageService) { }  
  
  loaded: boolean;
  errorMessage: string;
  successMessage: string;
  error: boolean;
  success: boolean;
  update: boolean;
  selectedFile: ImageSnippet;
  isSelected: boolean;

  table: Table= {
    guid: null,
    name: null,
    description: null,
    id: null,
    image: null,
    seatingCap: null,
    available: null
  }

  response: CommonResponse= {
    code: null,
    message: null
  }

  allTablesResponse : AllTablesResponse;

  filterTableName: string;
  
  page: number;
  paginator: boolean = true;
  loading: boolean;
  message: any;

  ngOnInit() {
    this.isSelected = false;
    this.loaded = false;
    this.getAllTables(true);
    this.loaded = true;
  }  
  
  save(){  
    this.errorMessage = "";
    this.successMessage = "";
    this.error = false;
    this.success = false;
    
    this.validate();
    if (!this.error) {
      this.loaded = false;

      if(this.isSelected){
        this.table.image = this.selectedFile.src;
      }
      this.tableService.createTable(this.table)
        .subscribe(r => {
          this.response = r;
          this.loaded = true;

          if(this.table.id != null && this.table.id.length > 0){
            this.successMessage = "Table updated successfully.";
          }else{
            this.successMessage = "Table created successfully.";
          }
          
          this.success = true;
          this.table.name = "";
          this.table.description = "";
          this.table.image = "";
          this.table.seatingCap = null;
          this.table.available = false;
          this.selectedFile = null;
          this.ngOnInit();
        }, error => {
          this.errorMessage = error.error.message;          
          this.loaded = true;
          this.error = true;
        });
    }else if(this.errorMessage != null && this.errorMessage.trim().length > 0){
      this.errorMessage = this.errorMessage;
      return
    }
  }

  validate(){

    if (this.table.name == null || this.table.name.length <= 0){
      this.errorMessage = this.errorMessage + "Name ";
    }

    if (this.table.seatingCap == null || this.table.seatingCap <= 0){
      if(this.errorMessage != null && this.errorMessage.length > 0){
        this.errorMessage = this.errorMessage + " / ";
      }
      this.errorMessage = this.errorMessage + "Seating Capacity ";
    }

    if (!this.update && this.selectedFile == null){
      if(this.errorMessage != null && this.errorMessage.length > 0){
        this.errorMessage = this.errorMessage + " / ";
      }
      this.errorMessage = this.errorMessage + "Image ";
    }

    if (this.update && (this.table.image == null || this.table.image.length == 0)){
      if(this.errorMessage != null && this.errorMessage.length > 0){
        this.errorMessage = this.errorMessage + " / ";
      }
      this.errorMessage = this.errorMessage + "Image ";
    }
    

    if (this.table.description == null || this.table.description.length <= 0){
      if(this.errorMessage != null && this.errorMessage.length > 0){
        this.errorMessage = this.errorMessage + " / ";
      }
      this.errorMessage = this.errorMessage + "Description ";
    }

    if(this.errorMessage != null && this.errorMessage.length > 0){
      this.errorMessage = this.errorMessage + "cannot be blank.";
    }

    if(this.errorMessage != null && this.errorMessage.trim().length > 0){
      this.error = true;
    }else{
      this.error = false;
    }
  }

  clear(){
    this.table.id = "";
    this.table.guid = null;
    this.table.name = "";
    this.table.description = "";
    this.table.image = "";
    this.table.seatingCap = null;
    this.table.available = false;
    this.selectedFile = null;
    this.errorMessage = "";
    this.successMessage = "";
    this.error = false;
    this.success = false;
    this.update = false;
    this.ngOnInit();
  }

  close(){
    this.error = false;
    this.success = false;
  }

  fetchTablesLazy(event) {
    this.loading = true;
    this.page = event.first / 12;

    this.getAllTables(false);
  }

  getAllTables(reset: boolean) {
    if (reset) {
      this.page = 0;
    }

    this.tableService.findAllTables(this.page)
      .subscribe((allTablesResponse: AllTablesResponse) => {
        this.allTablesResponse = allTablesResponse
        if (this.allTablesResponse.content.length == 0) {
          this.paginator = false;
        } else {
          this.paginator = true;
        }
        this.loading = false;
      }
      ); 
  }

  editTable(table: Table){
    this.table.name = table.name;
    this.table.description = table.description;
    this.table.guid = table.guid;
    this.table.id = table.id;
    this.table.seatingCap = table.seatingCap;
    this.table.available = table.available;
    this.table.image = table.image;
    this.update = true;
  }

  updateTable(){
    this.save();
    this.update = false;
  }

  delete(table: Table){
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete '+ table.name + '?',
      accept: () => {
        this.deleteTable(table.id);
      }
    });
  }

  deleteTable(id: string) {
    this.errorMessage = "";
    this.successMessage = "";
    this.error = false;
    this.success = false;

    this.tableService.deleteTable(id).subscribe(r => {
      this.response = r;

      if(this.response.code != null && this.response.code == "200"){
        this.success = true;
        this.successMessage = this.response.message;
      }else{
        this.error = true;
        this.errorMessage = this.response.message;
      }
      this.ngOnInit();
    });
  } 

  processFile(imageInput: any) {
    this.isSelected = true;
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.table.image = this.selectedFile.src;
    });
    reader.readAsDataURL(file);
  }
}

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

