import { Product } from 'src/app/models/product.model';
export interface Cart {
    total: number;
    data: [
        {
            product: Product;
            numInCart: number;
        }
    ];
}
export interface CartPublic {
    total: number;
    productData: [
        {
            id: number;
            incart: number;
        }
    ];
}
