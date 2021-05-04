import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Product, ServerResponse } from '../models/product.model';
import { switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private SERVER_URL = environment.SERVER_URL;

    constructor(private http: HttpClient, private router: Router) {}
    // fetch all products from the backend
    getAllProducts(numberOfResults = 10): Observable<ServerResponse> {
        return this.http.get<ServerResponse>(this.SERVER_URL + '/products', {
            params: {
                limit: numberOfResults.toString(),
            },
        });
    }
    // get single product
    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>(this.SERVER_URL + '/products/' + id);
    }
    // get products from one category
    getProductsFromCategory(categoryName: string): Observable<Product[]> {
        return this.http.get<Product[]>(this.SERVER_URL + '/products/category/' + categoryName);
    }

    deleteProduct(productId): Observable<any> {
        return this.http
            .delete<{ message?: string; status: string }>(`${this.SERVER_URL}/products/delete/${productId}`)
            .pipe(
                switchMap(async (data) => {
                    const prods = await this.getAllProducts().toPromise();
                    return {
                        ...data,
                        ...prods,
                    };
                }),
            );
    }
}
