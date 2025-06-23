import { Injectable } from '@angular/core';
import { Product } from './product';

// Hace que este servicio esté disponible globalmente
@Injectable({
  providedIn: 'root'
})

export class CartService {
  // Lista de productos en el carrito, incluyendo la cantidad de cada uno
  private products: (Product & { cantidad: number })[] = [];

  // Agrega un producto al carrito
  agregarProduct(product: Product, cantidad: number = 1) {
    // Verifica si el producto ya está en el carrito
    const existente = this.products.find(p => p.id === product.id);
    if (existente) {
      // Si ya existe, aumenta la cantidad
      existente.cantidad += cantidad;
    } else {
      // Si no existe, lo agrega con la cantidad indicada
      this.products.push({ ...product, cantidad });
    }
  }

  // Devuelve todos los productos del carrito
  obtenerProducts() {
    return this.products;
  }

  // Vacía el carrito completamente
  limpiarCart() {
    this.products = [];
  }

  // Elimina un producto por su ID
  eliminarProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
  }

  // Actualiza la cantidad de un producto existente
  actualizarCantidad(id: number, nuevaCantidad: number) {
    const product = this.products.find(p => p.id === id);
    if (product) {
      product.cantidad = nuevaCantidad;
    }
  }
}