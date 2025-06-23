import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../app/service/cart';
import { Product } from '../../app/service/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})

export class CartComponent {
  
  // Lista de productos que están en el carrito, con cantidad incluida
  products: (Product & { cantidad: number })[] = [];
  
  constructor(private cartService: CartService, private router: Router) {
    // Al iniciar, cargamos los productos del carrito desde el servicio
    this.products = this.cartService.obtenerProducts();
  }

  // Función para eliminar un producto del carrito
  eliminar(id: number) {
    this.cartService.eliminarProduct(id);
    this.products = this.cartService.obtenerProducts(); // Actualizamos la lista local
  }

  // Función para actualizar la cantidad de un producto en el carrito
  actualizarCantidad(id: number, event: Event) {
    const cantidad = +(event.target as HTMLInputElement).value; // Obtenemos el número del input
    if (cantidad > 0) {
      this.cartService.actualizarCantidad(id, cantidad); // Actualizamos en el servicio
    }
  }

  // Redirige a la pantalla de factura para generar la compra
  generarBill() {
    this.router.navigate(['/bill']);
  }
}