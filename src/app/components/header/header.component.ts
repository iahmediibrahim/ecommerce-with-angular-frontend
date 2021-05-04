import { UserService } from './../../services/user.service';
import { Cart } from './../../models/cart.model';
import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: [ './header.component.scss' ],
})
export class HeaderComponent implements OnInit {
    cartData: Cart;
    cartTotal: number;
    authState: boolean;
    constructor(public cartService: CartService, private userService: UserService) {}

    ngOnInit(): void {
        this.cartService.cartTotal$.subscribe((total) => {
            this.cartTotal = total;
        });

        this.cartService.cartData$.subscribe((data) => (this.cartData = data));
        this.userService.authState$.subscribe((auth) => (this.authState = auth));
    }
}
