import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductComponent } from './components/product/product.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
    },
    {
        path: 'thankyou',
        component: ThankyouComponent,
    },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
})
export class AppRoutingModule {}
