import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register';
import { LoginComponent } from './login/login';
import { ProductComponent } from './product/product';
import { CartComponent } from './cart/cart';
import { ProductListComponent } from './product-list/product-list';
import { BillComponent } from './bill/bill';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    //{path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'product', component: ProductComponent},
    {path: 'product/new', component: ProductListComponent},
    {path: 'cart', component: CartComponent},
    {path: 'bill', component: BillComponent}
];