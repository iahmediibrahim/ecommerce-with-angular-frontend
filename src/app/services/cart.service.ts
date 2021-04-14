import { Product } from 'src/app/models/product.model';
import { CartPublic, Cart } from './../models/cart.model';
import { OrderService } from './order.service';
import { ProductService } from './product.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private SERVER_URL = environment.SERVER_URL;
    // Data variable to store the cart info on the client's local storage
    private cartDataClient: CartPublic = {
        total: 0,
        productData: [
            {
                incart: 0,
                id: 0,
            },
        ],
    };
    // Data variable to store cart information on the server
    private cartDataServer: Cart = {
        total: 0,
        data: [
            {
                product: undefined,
                numInCart: 0,
            },
        ],
    };
    // Observables for the components to subscribe
    cartTotal$ = new BehaviorSubject<number>(0);
    cartData$ = new BehaviorSubject<Cart>(this.cartDataServer);

    constructor(
        private http: HttpClient,
        private productService: ProductService,
        private orderService: OrderService,
        private router: Router,
        private toast: ToastrService,
        private spinner: NgxSpinnerService,
    ) {
        this.cartTotal$.next(this.cartDataServer.total);
        this.cartData$.next(this.cartDataServer);

        let info: CartPublic = JSON.parse(localStorage.getItem('cart'));

        if (info !== null && info !== undefined && info.productData[0].incart !== 0) {
            // assign the value to our data variable which corresponds to the LocalStorage data format
            this.cartDataClient = info;

            // Loop through each entry and put it in the cartDataServer object
            this.cartDataClient.productData.forEach((p) => {
                this.productService.getProduct(p.id).subscribe((actualProdInfo: Product) => {
                    if (this.cartDataServer.data[0].numInCart === 0) {
                        this.cartDataServer.data[0].numInCart = p.incart;
                        this.cartDataServer.data[0].product = actualProdInfo;
                        this.calculateTotal();
                        this.cartDataClient.total = this.cartDataServer.total;
                        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                    } else {
                        this.cartDataServer.data.push({
                            numInCart: p.incart,
                            product: actualProdInfo,
                        });
                        this.calculateTotal();
                        this.cartDataClient.total = this.cartDataServer.total;
                        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                    }
                    this.cartData$.next({ ...this.cartDataServer });
                });
            });
        }
    }

    addProductToCart(id: number, quantity?: number) {
        this.productService.getProduct(id).subscribe((product) => {
            // 1. if the cart is empty
            if (this.cartDataServer.data[0].product === undefined) {
                this.cartDataServer.data[0].product = product;
                this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
                this.calculateTotal();
                this.cartDataClient.productData[0].incart = this.cartDataServer.data[0].numInCart;
                this.cartDataClient.productData[0].id = product.id;
                this.cartDataClient.total = this.cartDataServer.total;
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                this.cartData$.next({ ...this.cartDataServer });
                this.toast.success(`${product.name} added to the cart`, 'Product Added', {
                    timeOut: 1500,
                    progressBar: true,
                    progressAnimation: 'increasing',
                    positionClass: 'toast-top-right',
                });
            } else {
                // 2. if the cart has some items
                let index = this.cartDataServer.data.findIndex((p) => p.product.id === product.id); // -1 or a positive value
                // a. if that item is already in the cart => index is positive  then i have to update it
                if (index !== -1) {
                    if (quantity !== undefined && quantity <= product.quantity) {
                        this.cartDataServer.data[index].numInCart =
                            this.cartDataServer.data[index].numInCart < product.quantity ? quantity : product.quantity;
                    } else {
                        this.cartDataServer.data[index].numInCart < product.quantity
                            ? this.cartDataServer.data[index].numInCart++
                            : product.quantity;
                    }
                    this.cartDataClient.productData[index].incart = this.cartDataServer.data[index].numInCart;

                    this.toast.info(`${product.name} quantity updated in the cart`, 'Product Updated', {
                        timeOut: 1500,
                        progressBar: true,
                        progressAnimation: 'increasing',
                        positionClass: 'toast-top-right',
                    });
                } else {
                    // b. if that item is not in the cart => -1 item have to be added
                    this.cartDataServer.data.push({
                        numInCart: 1,
                        product,
                    });
                    this.cartDataClient.productData.push({
                        incart: 1,
                        id: product.id,
                    });
                    console.log(this.cartDataClient.productData);

                    this.toast.success(`${product.name} added to the cart`, 'Product Added', {
                        timeOut: 1500,
                        progressBar: true,
                        progressAnimation: 'increasing',
                        positionClass: 'toast-top-right',
                    });
                }
                this.calculateTotal();
                this.cartDataClient.total = this.cartDataServer.total;
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                this.cartData$.next({ ...this.cartDataServer });
            }
        });
    }

    updateCartItems(index: number, increase: boolean) {
        let data = this.cartDataServer.data[index];
        if (increase) {
            data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
            this.cartDataClient.productData[index].incart = data.numInCart;
            this.calculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            this.cartData$.next({ ...this.cartDataServer });
        } else {
            data.numInCart--;

            if (data.numInCart < 1) {
                this.deleteProductFromCart(index);
                this.cartData$.next({ ...this.cartDataServer });
            } else {
                this.cartDataClient.productData[index].incart = data.numInCart;
                this.calculateTotal();

                this.cartDataClient.total = this.cartDataServer.total;
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                this.cartData$.next({ ...this.cartDataServer });
            }
        }
    }

    deleteProductFromCart(index: number) {
        if (window.confirm('Are you sure you want to remove the item?')) {
            this.cartDataServer.data.splice(index, 1);
            this.cartDataClient.productData.splice(index, 1);
            this.calculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            if (this.cartDataClient.total === 0) {
                this.cartDataClient = {
                    total: 0,
                    productData: [
                        {
                            incart: 0,
                            id: 0,
                        },
                    ],
                };
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            } else {
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            }

            if (this.cartDataServer.total === 0) {
                this.cartDataServer = {
                    total: 0,
                    data: [
                        {
                            product: undefined,
                            numInCart: 0,
                        },
                    ],
                };
                this.cartData$.next({ ...this.cartDataServer });
            } else {
                this.cartData$.next({ ...this.cartDataServer });
            }
        } else {
            return;
        }
    }

    private calculateTotal() {
        let total = 0;
        this.cartDataServer.data.forEach((p) => {
            const { numInCart } = p;
            const { price } = p.product;
            total += numInCart * price;
        });
        this.cartDataServer.total = total;
        this.cartTotal$.next(this.cartDataServer.total);
    }
    checkoutFromCart(userId: number) {
        this.http.post(`${this.SERVER_URL}/oreders/payment`, null).subscribe((res: any) => {
            if (res.success) {
                this.resetServerData();
                this.http
                    .post(`${this.SERVER_URL}/orders/new`, { userId, products: this.cartDataClient.productData })
                    .subscribe((data: OrderResponse) => {
                        this.orderService.getOrder(data.order_id).then((products) => {
                            if (data.success) {
                                const navigationExtras: NavigationExtras = {
                                    state: {
                                        orderId: data.order_id,
                                        total: this.cartDataClient.total,
                                        message: data.message,
                                        products,
                                    },
                                };
                                this.spinner.hide().then();
                                this.router.navigate([ '/thankyou' ], navigationExtras).then((p) => {
                                    this.cartDataClient = {
                                        total: 0,
                                        productData: [
                                            {
                                                incart: 0,
                                                id: 0,
                                            },
                                        ],
                                    };
                                    this.cartTotal$.next(0);
                                    localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                                });
                            }
                        });
                    });
            } else {
                this.spinner.hide().then();
                this.router.navigateByUrl('/checkout').then();
                this.toast.error(`Sorry, failed to book the order.`, 'Order Status', {
                    timeOut: 1500,
                    progressBar: true,
                    progressAnimation: 'increasing',
                    positionClass: 'toast-top-right',
                });
            }
        });
    }

    calculateSubTotal(index): number {
        let subTotal = 0;

        let p = this.cartDataServer.data[index];
        subTotal = p.product.price * p.numInCart;

        return subTotal;
    }
    private resetServerData() {
        this.cartDataServer = {
            total: 0,
            data: [
                {
                    product: undefined,
                    numInCart: 0,
                },
            ],
        };
        this.cartData$.next({ ...this.cartDataServer });
    }
}

interface OrderResponse {
    order_id: number;
    success: boolean;
    message: string;
    products: [
        {
            id: string;
            numInCart: string;
        }
    ];
}
