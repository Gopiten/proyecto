import { Injectable } from '@angular/core';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private products: (Product & { cantidad: number })[] = [];

  agregarProduct(product: Product, cantidad: number = 1) {
    const existente = this.products.find(p => p.id === product.id);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      this.products.push({ ...product, cantidad });
    }
  }

  obtenerProducts() {
    return this.products;
  }

  limpiarCart() {
    this.products = [];
  }

  eliminarProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
  }

  actualizarCantidad(id: number, nuevaCantidad: number) {
    const product = this.products.find(p => p.id === id);
    if (product) {
      product.cantidad = nuevaCantidad;
    }
  }
}