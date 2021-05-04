import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Cart } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: [ './checkout.component.scss' ],
})
export class CheckoutComponent implements OnInit {
    cartData: Cart;
    cartTotal: number;
    showSpinner: boolean;
    checkoutForm: any;
    userId;

    constructor(
        private cartService: CartService,
        private orderService: OrderService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private userService: UserService,
        private fb: FormBuilder,
    ) {
        this.checkoutForm = this.fb.group({
            firstname: [ '', [ Validators.required ] ],
            lastname: [ '', [ Validators.required ] ],
            email: [ '', [ Validators.required, Validators.email ] ],
            phone: [ '', [ Validators.required ] ],
        });
    }

    ngOnInit() {
        this.cartService.cartData$.subscribe((data) => (this.cartData = data));
        this.cartService.cartTotal$.subscribe((total) => (this.cartTotal = total));
        this.userService.userData$.subscribe((data) => {
            // @ts-ignore
            this.userId = data.userId || data.id;
            console.log(this.userId);
        });
    }

    onCheckout() {
        this.spinner.show().then((p) => {
            this.cartService.checkoutFromCart(this.userId);
        });

        console.log(this.checkoutForm.value);
    }
}
