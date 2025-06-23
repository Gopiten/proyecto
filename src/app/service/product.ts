import { Injectable } from '@angular/core';

// Interfaz que define la estructura de un producto
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

  // Clave usada para guardar y recuperar datos del localStorage
  private key = 'products';

  constructor() {}

  // Obtiene la lista de productos desde el localStorage
  obtenerProducts(): Product[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : []; // Si no hay datos, devuelve array vacío
  }

  // Agrega un nuevo producto a la lista
  agregarProduct(product: Product): void {
    const products = this.obtenerProducts();
    product.id = new Date().getTime(); // Asigna un ID único basado en timestamp
    products.push(product);
    localStorage.setItem(this.key, JSON.stringify(products)); // Guarda en localStorage
  }

  // Actualiza un producto existente por su ID
  actualizarProduct(product: Product): void {
    let products = this.obtenerProducts();
    products = products.map(p => p.id === product.id ? product : p); // Reemplaza el producto con el mismo ID
    localStorage.setItem(this.key, JSON.stringify(products));
  }

  // Elimina un producto de la lista por su ID
  eliminarProduct(id: number): void {
    const products = this.obtenerProducts().filter(p => p.id !== id);
    localStorage.setItem(this.key, JSON.stringify(products));
  }

  // Busca y devuelve un producto por su ID (o undefined si no lo encuentra)
  obtenerProductPorId(id: number): Product | undefined {
    return this.obtenerProducts().find(p => p.id === id);
  }
}