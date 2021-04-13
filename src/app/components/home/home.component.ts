import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerResponse, Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: [ './home.component.scss' ],
})
export class HomeComponent implements OnInit {
    products: Product[] = [];
    constructor(private productService: ProductService, private cartService: CartService, private router: Router) {}

    ngOnInit(): void {
        this.productService.getAllProducts(8).subscribe((prods: ServerResponse) => {
            this.products = prods.products;
            console.log(this.products);
        });
    }
    AddProduct(id: number) {
        this.cartService.addProductToCart(id);
    }

    selectProduct(id: Number) {
        this.router.navigate([ '/product', id ]).then();
    }
}
