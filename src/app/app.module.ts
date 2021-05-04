import { RegisterComponent } from './components/register/register.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import {
    SocialLoginModule,
    SocialAuthServiceConfig,
    GoogleLoginProvider,
    FacebookLoginProvider,
} from 'angularx-social-login';
import { ManageProductsComponent } from './components/admin/manage-products/manage-products.component';
@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        CartComponent,
        CheckoutComponent,
        HomeComponent,
        ProductComponent,
        ThankyouComponent,
        LoginComponent,
        RegisterComponent,
        ManageProductsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NgxSpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        SocialLoginModule,
    ],
    providers: [
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider('clientId'),
                    },
                    {
                        id: FacebookLoginProvider.PROVIDER_ID,
                        provider: new FacebookLoginProvider('clientId'),
                    },
                ],
            } as SocialAuthServiceConfig,
        },
    ],
    bootstrap: [ AppComponent ],
})
export class AppModule {}
