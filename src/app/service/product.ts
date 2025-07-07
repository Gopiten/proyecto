import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen: string;
}

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private key = 'products';

  constructor() {}

  obtenerProducts(): Product[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  agregarProduct(product: Product): void {
    const products = this.obtenerProducts();
    product.id = new Date().getTime();
    products.push(product);
    localStorage.setItem(this.key, JSON.stringify(products));
  }

  actualizarProduct(product: Product): void {
    let products = this.obtenerProducts();
    products = products.map(p => p.id === product.id ? product : p);
    localStorage.setItem(this.key, JSON.stringify(products));
  }

  eliminarProduct(id: number): void {
    const products = this.obtenerProducts().filter(p => p.id !== id);
    localStorage.setItem(this.key, JSON.stringify(products));
  }

  obtenerProductPorId(id: number): Product | undefined {
    return this.obtenerProducts().find(p => p.id === id);
  }
}