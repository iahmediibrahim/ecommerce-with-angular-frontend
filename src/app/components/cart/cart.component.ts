import { CartService } from 'src/app/services/cart.service';
import { Cart } from './../../models/cart.model';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: [ './cart.component.scss' ],
})
export class CartComponent implements OnInit {
    cartData: Cart;
    cartTotal: number;
    subTotal: number;
    constructor(public cartService: CartService) {}

    ngOnInit(): void {
        this.cartService.cartData$.subscribe((data) => (this.cartData = data));
        this.cartService.cartTotal$.subscribe((total) => (this.cartTotal = total));
    }
    changeQuantity(id: number, increaseQuantity: boolean) {
        this.cartService.updateCartItems(id, increaseQuantity);
    }
}
