import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { PmComponent } from './pm/pm.component';

import { httpInterceptorProviders } from './auth/auth-interceptor';
import { TableComponent } from './table/table.component';
import { MenuComponent } from './menu/menu.component';
import { BillingComponent } from './billing/billing.component';
import { ReportsComponent } from './reports/reports.component';
import { RatingsComponent } from './ratings/ratings.component';
import { RolesComponent } from './roles/roles.component';
import { DepartmentsComponent } from './departments/departments.component';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/components/panel/panel';
import { ButtonModule } from 'primeng/components/button/button';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { SlideMenuModule } from 'primeng/slidemenu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { SidebarModule } from 'primeng/sidebar';
import { MegaMenuModule } from 'primeng/megamenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressBarModule } from 'primeng/progressbar';
import { GrowlModule } from 'primeng/growl';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { TreeTableModule } from 'primeng/treetable';
import { DataScrollerModule } from 'primeng/datascroller';
import { BlockUIModule } from 'primeng/blockui';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {PaginatorModule} from 'primeng/paginator';
import {MenubarModule} from 'primeng/menubar';
import {MenuItem, ConfirmationService} from 'primeng/api';
import {PasswordModule} from 'primeng/password';
import {InplaceModule} from 'primeng/inplace';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {TabMenuModule} from 'primeng/tabmenu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpModule } from '@angular/http';
import {KeyFilterModule} from 'primeng/keyfilter';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    HomeComponent,
    AdminComponent,
    PmComponent,
    TableComponent,
    BillingComponent,
    ReportsComponent,
    MenuComponent,
    RatingsComponent,
    RolesComponent,
    DepartmentsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    ProgressBarModule,
    PanelModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    BrowserAnimationsModule,
    FileUploadModule,
    DropdownModule,
    CalendarModule,
    MultiSelectModule,
    MenuModule,
    DialogModule,
    CheckboxModule,
    SlideMenuModule,
    ContextMenuModule,
    MessagesModule,
    MessageModule,
    SidebarModule,
    MegaMenuModule,
    TieredMenuModule,
    PanelMenuModule,
    RadioButtonModule,
    GrowlModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    TabViewModule,
    TreeTableModule,
    FontAwesomeModule,
    DataScrollerModule,
    BlockUIModule,
    HttpModule,
    OverlayPanelModule,
    PaginatorModule,
    MenubarModule, 
    PasswordModule,
    InplaceModule,
    AutoCompleteModule, 
    TabMenuModule,
    KeyFilterModule
  ],
  providers: [httpInterceptorProviders, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
