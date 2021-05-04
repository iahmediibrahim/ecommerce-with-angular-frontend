import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductComponent } from './components/product/product.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileGuard } from './guard/profile.guard';
import { RegisterComponent } from './components/register/register.component';
import { ManageProductsComponent } from './components/admin/manage-products/manage-products.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'product/:id',
        component: ProductComponent,
    },
    {
        path: 'cart',
        component: CartComponent,
    },
    {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [ ProfileGuard ],
    },
    {
        path: 'thankyou',
        component: ThankyouComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [ ProfileGuard ],
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'admin/manage-products',
        component: ManageProductsComponent,
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: '',
    },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
})
export class AppRoutingModule {}
