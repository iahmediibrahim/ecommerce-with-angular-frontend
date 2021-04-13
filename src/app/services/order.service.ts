import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    private products: ProductResponse[] = [];
    private SERVER_URL = environment.SERVER_URL;
    constructor(private http: HttpClient) {}
    getOrder(orderId: number) {
        return this.http.get<ProductResponse[]>(this.SERVER_URL + '/orders/' + orderId).toPromise();
    }
}

interface ProductResponse {
    id: number;
    title: string;
    description: string;
    price: number;
    quantityOrdered: number;
    image: string;
}
