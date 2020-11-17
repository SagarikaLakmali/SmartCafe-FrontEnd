import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { PmComponent } from './pm/pm.component';
import { AdminComponent } from './admin/admin.component';
import { TableComponent } from './table/table.component';
import { BillingComponent } from './billing/billing.component';
import { ReportsComponent } from './reports/reports.component';
import { MenuComponent } from './menu/menu.component';
import { RatingsComponent } from './ratings/ratings.component';
import { RolesComponent } from './roles/roles.component';
import { DepartmentsComponent } from './departments/departments.component';
import { CustomerMenuComponent } from './customermenu/customermenu.component';

const routes: Routes = [
    {
        path: 'home',
        //component: HomeComponent
        component: LoginComponent
    },
    {
        path: 'user',
        component: UsersComponent
    },
    {
        path: 'pm',
        component: PmComponent
    },
    {
        path: 'admin',
        component: AdminComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'table',
        component: TableComponent
    },
    {
        path: 'billing',
        component: BillingComponent
    },
    {
        path: 'reports',
        component: ReportsComponent
    },
    {
        path: 'menu',
        component: MenuComponent
    },
    {
        path: 'ratings',
        component: RatingsComponent
    },
    {
        path: 'roles',
        component: RolesComponent
    },
    {
        path: 'departments',
        component: DepartmentsComponent
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'customermenu',
        component: CustomerMenuComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
